const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGO_CONNECTION_STRING || process.env.COSMOS_MONGO_URI;
let client;
async function getCollection() {
  if (!mongoUri) throw new Error('MONGO_CONNECTION_STRING is not set');
  if (!client) {
    client = new MongoClient(mongoUri);
    await client.connect();
  }
  return client.db('callshield').collection('reports');
}

module.exports = async function (context, req) {
  const { number, category, locale, ts, deviceId } = req.body || {};

  if (!number || !category) {
    context.res = {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
      body: { error: 'number_and_category_required' },
    };
    return;
  }

  try {
    const col = await getCollection();
    await col.insertOne({
      number,
      category,
      locale: locale ?? 'unknown',
      deviceId: deviceId ?? null,
      ts: ts ?? Date.now(),
    });

    context.res = {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
      body: { ok: true },
    };
  } catch (err) {
    context.log.error('Failed to store report', err);
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: { error: 'failed_to_store_report' },
    };
  }
};
