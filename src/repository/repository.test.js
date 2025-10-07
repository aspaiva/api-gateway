const { test, expect } = require('@jest/globals');
const repo = require('./repository');

test('Get user by username - existing user', async () => {
    const user = await repo.getUserByUsername('admin');
    expect(user).toBeDefined();
    expect(user.username).toBe('admin');
});

