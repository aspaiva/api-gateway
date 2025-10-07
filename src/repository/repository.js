const db = require('../config/database');

async function getUserByUsername(username) {
    console.log('Fetching user by username:', username);
    const database = await db.connect();
    const user = await database.collection('users').findOne({ username: username });
    console.log('User found:', user);

    // await db.closeConnection();

    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

module.exports = { getUserByUsername };
