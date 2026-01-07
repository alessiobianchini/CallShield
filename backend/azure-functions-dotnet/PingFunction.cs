using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace CallShield.Functions;

public class PingFunction
{
    [Function("Ping")]
    public HttpResponseData Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "ping")] HttpRequestData req)
    {
        var res = req.CreateResponse(HttpStatusCode.OK);
        res.WriteAsJsonAsync(new
        {
            ok = true,
            message = "pong",
            node = Environment.GetEnvironmentVariable("WEBSITE_NODE_DEFAULT_VERSION"),
            dotnet = Environment.Version.ToString()
        }).GetAwaiter().GetResult();
        return res;
    }
}
