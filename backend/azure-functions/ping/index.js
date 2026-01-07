const { app } = require('@azure/functions');
const fs = require('fs/promises');

app.http('httpTriggerGoodAsync', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      return { body: { success: true } };
    } catch (err) {
      context.error(err);
      // This rethrown exception will only fail the individual invocation, instead of crashing the whole process
      throw err;
    }
  },
});