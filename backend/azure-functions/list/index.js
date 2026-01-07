const { MongoClient } = require('mongodb');

const DEFAULT_LIMIT = Number(process.env.LIST_LIMIT || 5000);
const mongoUri = process.env.MONGO_CONNECTION_STRING || process.env.COSMOS_MONGO_URI;

let client;
async function getCollection() {
  if (!mongoUri) {
    throw new Error('MONGO_CONNECTION_STRING is not set');
  }
  if (!client) {
    client = new MongoClient(mongoUri);
    await client.connect();
  }
  return client.db('callshield').collection('calllist');
}

module.exports = async function (context, req) {
  const since = req.query.since ?? req.query.version ?? '0';
  const limit = Number.isFinite(DEFAULT_LIMIT) ? DEFAULT_LIMIT : 5000;

  try {
    const col = await getCollection();
    const versionNumber = Number(since) || 0;
    const docs = await col
      .find({ version: { $gt: versionNumber } })
      .sort({ version: 1 })
      .limit(limit)
      .toArray();

    const add = [];
    const remove = [];
    const update = [];

    docs.forEach(d => {
      if (d.action === 'add') add.push({ number: d.number, label: d.label, risk: d.risk });
      if (d.action === 'remove') remove.push({ number: d.number });
      if (d.action === 'update') update.push({ number: d.number, label: d.label, risk: d.risk });
    });

    const latest = docs.length ? docs[docs.length - 1].version : versionNumber;

    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { version: latest, add, remove, update },
    };
  } catch (err) {
    context.log.error('Failed to fetch delta list', err);
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: { error: 'failed_to_fetch_delta' },
    };
  }
};
