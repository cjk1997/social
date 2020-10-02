const { set } = require('../app');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const url = process.env.DB_URL;

const dbName = 'social';
const colName = 'posts';

const settings = { useUnifiedTopology: true };

const getPosts = () => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to retrieve posts.");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.find({}).toArray(function(err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                        client.close();
                    };
                });
            };
        });
    });
    return iou;
};

const createPost = (post) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to create post.");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.insertOne(post, function(err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                        client.close();
                    };
                });
            };
        });
    });
    return iou;
};

const deletePost = (postID) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to delete post.");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.deleteOne({ _id: ObjectID(postID) }, function(err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                        client.close();
                    };
                });
            };
        });
    });
    return iou;
};

module.exports = {
    getPosts,
    createPost,
    deletePost,
};