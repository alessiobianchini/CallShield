using MongoDB.Driver;

namespace CallShield.Functions;

internal static class MongoHelper
{
    private static MongoClient? _client;
    private static IMongoDatabase? _db;

    internal static IMongoCollection<T> GetCollection<T>(string name)
    {
        var connectionString = Environment.GetEnvironmentVariable("MONGO_CONNECTION_STRING");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("MONGO_CONNECTION_STRING is not set.");
        }

        if (_client == null)
        {
            _client = new MongoClient(connectionString);
            _db = _client.GetDatabase("callshield");
        }

        return _db!.GetCollection<T>(name);
    }
}
