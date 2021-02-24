'use strict';

const fs = require('fs');
const mongodb = require('mongodb');
const stream = require('stream');
const util = require('util');

async function test() {
    const mongoClient = await mongodb.MongoClient.connect('mongodb://localhost', {
        useUnifiedTopology: true
    });
    const mongoDb = mongoClient.db('test');
    const bucket = new mongodb.GridFSBucket(mongoDb, {
        bucketName: 'testBucket'
    });

    const fileStream = fs.createReadStream('test.js');
    const uploadStream = bucket.openUploadStream('test');
    await util.promisify(stream.pipeline)(fileStream, uploadStream);
}

test().then(() => {
    console.log('OK');
    process.exit(0);
}, e => {
    console.log(e);
    process.exit(1);
});
