const { test, expect } = require('@jest/globals');
const db = require('./database');

test('Database connection', async () => {
    const database = await db.connect();
    console.log('Connected to database:', database.databaseName);
    expect(database.databaseName).toBe(process.env.DB_NAME);
    expect(database).toBeDefined();
    await db.closeConnection();
});

test('Close database connection', async () => {
    await db.connect();
    const client = await db.closeConnection();
    expect(client).toBeNull();
});
