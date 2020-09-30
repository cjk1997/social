const { connect } = require('mongodb');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const url = process.env.DB_URL;

const dbName = 'social';
const colName = 'users';

const settings = { useUnifiedTopology: true };

const getUsers = () => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to retrieve user list.");
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

const getUser = (key, value) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to retrieve user.");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.find({ [key]: value }).toArray((err, result) => {
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

const registerUser = (user) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to register user.")
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.insertOne(user, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.ops[0]);
                        client.close();
                    };
                });
            };
        });
    });
    return iou;
};

const sendFriendRequest = (userID, friendRequest) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to send friend request.");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.updateOne({ _id: ObjectID(userID) },
                { $push: { friendRequests: { $each: friendRequest } } },
                function(err, result) {
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

const acceptFriendRequest = (userID, friendRequest) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to accept friend request.");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.updateOne({ _id: ObjectID(userID) }, { $push: { friends: { $each: friendRequest } } })
                collection.updateOne({ _id: ObjectID(userID) }, 
                { $pullAll: { friendRequests: friendRequest } }, function(err, result) {
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

const rejectFriendRequest = (userID, friendRequest) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to reject friend request.");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.updateOne({ _id: ObjectID(userID) },
                { $pullAll: { friendRequests: friendRequest } }, function(err, result) {
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

const deleteFriend = (userID, friend) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to delete friend.");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.updateOne({ _id: ObjectID(userID) },
                { $pullAll: { friends: friend } }, function(err, result) {
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
    getUsers,
    getUser,
    registerUser,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    deleteFriend,
};