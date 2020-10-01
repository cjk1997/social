const express = require('express');
const Router = express.Router();
const {
    getGroups,
    createGroup,
    editGroup,
    addMember,
    removeMember,
    deleteGroup,
} = require('../../data/groups');

Router.get('/', async function(req, res) {
    try {
        const data = await getGroups();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.post('/new', async function(req, res) {
    try {
        const data = await createGroup(req.body);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.put('/edit/:id', async function(req, res) {
    try {
        const data = await editGroup(req.params.id, req.body);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Interal server issues, check logs.");
    };
});

Router.patch('/members/add/:id', async function(req, res) {
    try {
        const data = await addMember(req.params.id, req.body);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.patch('/members/remove/:id', async function(req, res) {
    try {
        const data = await removeMember(req.params.id, req.body);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.delete('/:id', async function(req, res) {
    try {
        const data = await deleteGroup(req.params.id);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

module.exports = Router;