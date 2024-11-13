const { MongoClient, ObjectId } = require('mongodb');

process.env.MONGODB_URI = 'mongodb://assssssignment1:WMcp4Fg5Jq5fCezHVBf2P0xBAWlEp6vbRNSIa5YkDSTrm7DoTkzAZXP4L8eRgd8Lfz70fJDN0p3YACDbT4w1OA==@assssssignment1.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@assssssignment1@';

if (!process.env.MONGODB_URI) {
    // throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    process.env.MONGODB_URI = 'mongodb://localhost:27017';
}

// Connect to MongoDB
async function connectToDB() {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('bookingsDB');
    db.client = client;
    return db;
}

module.exports = { connectToDB, ObjectId };