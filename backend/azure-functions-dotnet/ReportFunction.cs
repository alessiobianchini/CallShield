using System.Net;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace CallShield.Functions;

public class ReportFunction
{
    [Function("Report")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "v1/report")] HttpRequestData req)
    {
        var res = req.CreateResponse();
        try
        {
            var body = await JsonSerializer.DeserializeAsync<ReportRequest>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            if (body == null || string.IsNullOrWhiteSpace(body.Number) || string.IsNullOrWhiteSpace(body.Category))
            {
                res.StatusCode = HttpStatusCode.BadRequest;
                await res.WriteAsJsonAsync(new { error = "number and category required" });
                return res;
            }

            var col = MongoHelper.GetCollection<ReportDocument>("reports");
            await col.InsertOneAsync(new ReportDocument
            {
                Number = body.Number,
                Category = body.Category,
                Locale = body.Locale ?? "unknown",
                DeviceId = body.DeviceId,
                Ts = body.Ts ?? DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
            });

            res.StatusCode = HttpStatusCode.Accepted;
            await res.WriteAsJsonAsync(new { ok = true });
        }
        catch (Exception ex)
        {
            res.StatusCode = HttpStatusCode.InternalServerError;
            await res.WriteAsJsonAsync(new { error = ex.Message });
        }

        return res;
    }

    private class ReportRequest
    {
        public string? Number { get; set; }
        public string? Category { get; set; }
        public string? Locale { get; set; }
        public string? DeviceId { get; set; }
        public long? Ts { get; set; }
    }

    private class ReportDocument
    {
        public string? Number { get; set; }
        public string? Category { get; set; }
        public string? Locale { get; set; }
        public string? DeviceId { get; set; }
        public long Ts { get; set; }
    }
}
