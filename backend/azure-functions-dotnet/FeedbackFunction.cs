using System.Net;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace CallShield.Functions;

public class FeedbackFunction
{
    [Function("Feedback")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "v1/feedback")] HttpRequestData req)
    {
        var res = req.CreateResponse();
        try
        {
            var body = await JsonSerializer.DeserializeAsync<FeedbackRequest>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            if (body == null || string.IsNullOrWhiteSpace(body.Number) || string.IsNullOrWhiteSpace(body.Action))
            {
                res.StatusCode = HttpStatusCode.BadRequest;
                await res.WriteAsJsonAsync(new { error = "number and action required" });
                return res;
            }

            var col = MongoHelper.GetCollection<FeedbackDocument>("feedback");
            await col.InsertOneAsync(new FeedbackDocument
            {
                Number = body.Number,
                Action = body.Action,
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

    private class FeedbackRequest
    {
        public string? Number { get; set; }
        public string? Action { get; set; }
        public string? DeviceId { get; set; }
        public long? Ts { get; set; }
    }

    private class FeedbackDocument
    {
        public string? Number { get; set; }
        public string? Action { get; set; }
        public string? DeviceId { get; set; }
        public long Ts { get; set; }
    }
}
