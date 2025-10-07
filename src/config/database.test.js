const { test, expect } = require('@jest/globals');
const db = require('./database');

test('Database connection', async () => {
    const client = await db.connect();
    expect(client).toBeDefined();
    await db.closeConnection();
});

test('Close database connection', async () => {
    await db.connect();
    const client = await db.closeConnection();
    expect(client).toBeNull();
});
