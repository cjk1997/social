const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    getUsers,
    getUser,
    registerUser,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
} = require('../../data/users');

const salt = process.env.SALT;
const privateKey = process.env.PRIVATE_KEY;

Router.get('/', async function(req, res) {
    try {
        const usersArray = await getUsers();
        if (usersArray.length === 0) {
            res.status(401).send("User Retrieval Failed")
            console.log("No users exist.")
        } else {
            const users = usersArray.filter((user) => user.email != "admin@admin.com").map((user) => {
                    return { "_id": user._id, "firstName": user.firstName, "lastName": user.lastName, "profilePic": user.profilePic }
            });
            res.send(users);
        };
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.post('/login', async function(req, res) {
    try {
        const body = req.body;
        const user = await getUser('email', body.email);
        if (user.length === 0) {
            res.status(401).send("Login Failed");
            console.log("That user does not exist.");
        } else if (user.length > 1) {
            res.status(500).send("Login Failed");
            console.log("That user exists more than once.");
        } else {
            bcrypt.compare(body.password, user[0].password, function(err, result) {
                if (err) throw(err);
                if (!result) {
                    res.status(401).send("Login Failed");
                    console.log("Password is incorrect.")
                } else {
                    jwt.sign({ _id: user[0]._id },
                        privateKey,
                        { algorithm: 'HS512' },
                        function(err, token) {
                            if (err) throw(err);
                            res.set('authentication', token);
                            delete user[0].password;
                            res.set('Access-Control-Expose-Headers', 'authentication, admin, user');
                            if (body.email === 'admin@admin.com') {
                                res.set('admin', 'admin');
                            };
                            res.send(user[0]);
                        }
                    );
                };
            });
        };
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.post('/register', async function(req, res) {
    try {
        const saltRounds = +salt;
        const body = req.body;
        const password = body.password;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) throw(err);
            bcrypt.hash(password, salt, async function(err, hash) {
                if (err) throw(err);
                body.password = hash;
                const user = await registerUser(req.body);
                jwt.sign({ _id: user._id },
                    privateKey,
                    { algorithm: 'HS512' },
                    function(err, token) {
                        if (err) throw(err);
                        console.log(body.email, token);
                        res.set('authentication', token);
                        delete user.password;
                        res.set('Access-Control-Expose-Headers', 'authentication, admin, user');
                        res.send(user);
                    }
                );
            });
        });
    } catch {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.patch('/friendRequest/send/:id', async function(req, res) {
    try {
        const data = await sendFriendRequest(req.params.id, req.body);
        res.send(data);
    } catch {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.patch('/friendRequest/accept/:id', async function(req, res) {
    try {
        const data = await acceptFriendRequest(req.params.id, req.body);
        res.send(data);
    } catch {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.patch('/friendRequest/reject/:id', async function(req, res) {
    try {
        const data = await rejectFriendRequest(req.params.id, req.body);
        res.send(data);
    } catch {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

module.exports = Router;