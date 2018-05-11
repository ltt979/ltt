const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var settings = require('../settings');
var util = require('util');

// Connection URL
const url = util.format('mongodb://%s:%s',settings.host,settings.port);

// Database Name
const dbName = settings.db;
var mongoblog;

// Use connect method to connect to the server
MongoClient.connect(url, {
    reconnectTries: 30
    , keepAlive: 1
}, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    mongoblog = db;
    // keep alive 
    // client.close();
});


exports.getMongoDB = function () {
    assert.notEqual(mongoblog, undefined, 'mongodb not connected');
    return mongoblog;
};
