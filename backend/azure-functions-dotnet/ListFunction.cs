using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using MongoDB.Driver;

namespace CallShield.Functions;

public class ListFunction
{
    private const int DefaultLimit = 5000;

    [Function("List")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "v1/list")] HttpRequestData req)
    {
        var res = req.CreateResponse();
        try
        {
            var collection = MongoHelper.GetCollection<CallListItem>("calllist");
            var sinceStr = req.Query["since"] ?? req.Query["version"];
            var since = long.TryParse(sinceStr, out var v) ? v : 0;
            var limitEnv = Environment.GetEnvironmentVariable("LIST_LIMIT");
            var limit = int.TryParse(limitEnv, out var l) && l > 0 ? l : DefaultLimit;

            var filter = Builders<CallListItem>.Filter.Gt(x => x.Version, since);
            var docs = await collection.Find(filter).SortBy(x => x.Version).Limit(limit).ToListAsync();

            var add = new List<object>();
            var remove = new List<object>();
            var update = new List<object>();

            foreach (var d in docs)
            {
                if (d.Action == "add") add.Add(new { number = d.Number, label = d.Label, risk = d.Risk });
                if (d.Action == "remove") remove.Add(new { number = d.Number });
                if (d.Action == "update") update.Add(new { number = d.Number, label = d.Label, risk = d.Risk });
            }

            var latest = docs.Count > 0 ? docs[^1].Version : since;
            await res.WriteAsJsonAsync(new { version = latest, add, remove, update });
            res.StatusCode = HttpStatusCode.OK;
        }
        catch (Exception ex)
        {
            res.StatusCode = HttpStatusCode.InternalServerError;
            await res.WriteAsJsonAsync(new { error = ex.Message });
        }

        return res;
    }

    private class CallListItem
    {
        public string? Number { get; set; }
        public string? Label { get; set; }
        public string? Risk { get; set; }
        public string? Action { get; set; }
        public long Version { get; set; }
        public long Ts { get; set; }
    }
}
