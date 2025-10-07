const db = require('mongodb');

let client;

async function connect() {
    if (!client || !client.topology || client.topology.isClosed) {
        client = new db.MongoClient(process.env.DB_URL, { useUnifiedTopology: true });
        await client.connect();
    }
    return client.db(process.env.DB_NAME);
}

async function closeConnection() {
    if (client) {
        try {
            await client.close();
        } catch (error) {
            throw error;
        }
        client = null;
    }
    return client;
}

module.exports = { connect, closeConnection };
