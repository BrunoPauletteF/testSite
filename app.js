const { MongoClient } = require('mongodb');
const { DB_URL } = process.env;

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const client = await MongoClient.connect(DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    if (!client) {
      return { statusCode: 500, body: 'Failed to connect to DB!' };
    }

    const db = client.db('pageVisit');
    const collection = db.collection('visit');
    const reqBody = JSON.parse(event.body);

    const visitRecord = {
      page: reqBody.page || 'unknown',
      visit_time: reqBody.visitTime,
      log_time: new Date(),
    };
    await collection.insertOne(visitRecord);

    return { statusCode: 200, body: 'SUCCESS' };
  } catch (e) {
    return { statusCode: 500, body: 'Something Went Wrong' };
  } finally {
    await client.close();
  }
};

export const logVisit = async (pageName, userConsent) => {
  const visitTime = new Date();
  const skipLogVisit = !userConsent;
  try {
    if (!skipLogVisit) {
      await fetch(`${process.env.API_URL}${API_PATHS.LOG_VISIT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pageName,
          visitTime: { time: visitTime, tz: visitTime.getTimezoneOffset() }
        })
      });
    }
  } catch (e) {
    console.log(e);
  }
};