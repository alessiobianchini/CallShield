using System.Net;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace CallShield.Functions;

public class ValidateReceiptFunction
{
    [Function("receipt")]
    public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Function, "post", Route = "v1/receipt")] HttpRequestData req)
    {
        var body = await new StreamReader(req.Body).ReadToEndAsync();
        var payload = JsonSerializer.Deserialize<ReceiptPayload>(body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (payload is null || string.IsNullOrWhiteSpace(payload.ReceiptData) || string.IsNullOrWhiteSpace(payload.ProductId))
        {
            var bad = req.CreateResponse(HttpStatusCode.BadRequest);
            await bad.WriteStringAsync("Invalid receipt payload");
            return bad;
        }

        var collection = MongoHelper.GetCollection<ReceiptRecord>("receipts");
        var record = new ReceiptRecord
        {
            Id = Guid.NewGuid().ToString(),
            Platform = payload.Platform?.ToLowerInvariant(),
            ProductId = payload.ProductId,
            TransactionId = payload.TransactionId,
            UserId = payload.UserId,
            ReceiptData = payload.ReceiptData,
            CreatedAt = DateTime.UtcNow,
            Status = "received"
        };

        await collection.InsertOneAsync(record);

        // Real validation (App Store / Play billing) should be added here and status updated accordingly.
        var ok = req.CreateResponse(HttpStatusCode.OK);
        await ok.WriteAsJsonAsync(new { status = "stored", id = record.Id });
        return ok;
    }
}

public class ReceiptPayload
{
    public string? Platform { get; set; }
    public string? ProductId { get; set; }
    public string? TransactionId { get; set; }
    public string? UserId { get; set; }
    public string? ReceiptData { get; set; }
}

public class ReceiptRecord
{
    public string Id { get; set; } = default!;
    public string? Platform { get; set; }
    public string? ProductId { get; set; }
    public string? TransactionId { get; set; }
    public string? UserId { get; set; }
    public string ReceiptData { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; } = "received";
}
