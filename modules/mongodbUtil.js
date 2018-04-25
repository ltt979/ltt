const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'blog';
var mongoblog;

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    mongoblog = db;
    client.close();
});


exports.getMongoDB = function () {
    assert.notEqual(mongoblog, undefined, 'mongodb not connected');
    return mongoblog;
};
