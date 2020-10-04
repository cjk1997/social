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

const editPost = (postID, post) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to edit post.");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.updateOne({ _id: ObjectID(postID) },
                { $set: { post: post } },
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

const likePost = (postID, user) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to like post.");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.updateOne({ _id: ObjectID(postID) },
                { $push: { likes: { $each: user } } },
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

const unlikePost = (postID, user) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to unlike post.");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.updateOne({ _id: ObjectID(postID) },
                { $pullAll: { likes: user } },
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

const postComment = (postID, comment) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to post comment.");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.updateOne({ _id: ObjectID(postID) },
                { $push: { comments: { $each: comment } } },
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

const editComment = (postID, commentID, comment) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to edit comment.");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.updateOne({ _id: ObjectID(postID) },
                { $set: { "comments.$[comment].comment": comment } },
                { arrayFilters: [{ "comment._id": ObjectID(commentID) }] },
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

const likeComment = (postID, commentID, user ) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to like comment.");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.updateOne({ _id: ObjectID(postID) },
                { $push: { "comments.$[comment].likes": user } },
                { arrayFilters: [{ "comment._id": ObjectID(commentID) }] },
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

const unlikeComment = (postID, commentID, user) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to unlike comment.");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.updateOne({ _id: ObjectID(postID) },
                { $pullAll: { "comments.$[comment].likes": user } },
                { arrayFilters: [{ "comment._id": ObjectID(commentID) }] },
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

const deleteComment = () => {}

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
    editPost,
    likePost,
    unlikePost,
    postComment,
    editComment,
    likeComment,
    unlikeComment,
    deletePost,
};