const { test, expect } = require('@jest/globals');
const repo = require('./repository');


test('Get user by username - existing user', async () => {
    const user = await repo.getUserByUsername('admin');
    expect(user).toBeDefined();
    expect(user.username).toBe('admin');
});

test('Add token to blacklist', async () => {
    const token = repo.getRandomToken();
    expect(repo.addBlacklist(token)).resolves.not.toThrow();
});

test('Check if token is blacklisted - not blacklisted', async () => {
    const token = 'notBlacklistedToken';
    const isBlacklisted = await repo.isBlacklisted(token);
    expect(isBlacklisted).toBe(false);
});

test('Check if token is blacklisted - blacklisted', async () => {
    const token = repo.getRandomToken();
    await repo.addBlacklist(token);
    const isBlacklisted = await repo.isBlacklisted(token);
    expect(isBlacklisted).toBe(true);
});

