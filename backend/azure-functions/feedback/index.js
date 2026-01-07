const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGO_CONNECTION_STRING || process.env.COSMOS_MONGO_URI;
let client;
async function getCollection() {
  if (!mongoUri) throw new Error('MONGO_CONNECTION_STRING is not set');
  if (!client) {
    client = new MongoClient(mongoUri);
    await client.connect();
  }
  return client.db('callshield').collection('feedback');
}

module.exports = async function (context, req) {
  const { number, action, ts, deviceId } = req.body || {};

  if (!number || !action) {
    context.res = {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
      body: { error: 'number_and_action_required' },
    };
    return;
  }

  try {
    const col = await getCollection();
    await col.insertOne({
      number,
      action,
      deviceId: deviceId ?? null,
      ts: ts ?? Date.now(),
    });

    context.res = {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
      body: { ok: true },
    };
  } catch (err) {
    context.log.error('Failed to store feedback', err);
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: { error: 'failed_to_store_feedback' },
    };
  }
};
