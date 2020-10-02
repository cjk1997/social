const express = require('express');
const Router = express.Router();
const {
    getPosts,
} = require('../../data/posts');

Router.get('/', async function(req, res) {
    try {
        const data = await getPosts();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

module.exports = Router;