const { get } = require('http');
const db = require('../config/database');

async function getUserByUsername(username) {
    console.log('Fetching user by username:', username);
    const database = await db.connect();
    const user = await database.collection('users').findOne({ username: username });
    console.log('User found:', user);
    
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

async function addBlacklist(token) {
    if (!token) {
        throw new Error('Token is required');
    }

    const database = await db.connect();
    return await database.collection('blacklist').insertOne({ _id: token, data: new Date() });
}

async function isBlacklisted(token) {
    if (!token) {
        throw new Error('Token is required');
    }
    const database = await db.connect();
    const count = await database.collection('blacklist').countDocuments({ _id: token });
    return count > 0;
}

function getRandomToken() {
    return db.getRandomToken();
}

async function checkBlacklist(req, res, next) {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const isBlacklistedToken = await isBlacklisted(token);
    if (isBlacklistedToken) {
        return res.status(401).json({ message: 'Token is blacklisted' });
    }
    next();
}

module.exports = { getUserByUsername, addBlacklist, isBlacklisted, getRandomToken };
