const express = require("express");
const app = express();
const { User, Matcher, Party, MatcherParty } = require("../models/index")
const { db } = require("../db/connection");
const { check, validationResult } = require('express-validator')
const { Op } = require('@sequelize/core')

app.use(express.json());
app.use(express.urlencoded());

// User routes (mainly for manual testing)
app.get("/users", async(req, res) => {
    const allUsers = await User.findAll();
    res.send(allUsers);
});

app.get("/users/:id", async(req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    res.send(user);
});

app.post("/users", async (req, res) => {
    const createdUser = await User.create(req.body);
    res.json(createdUser);
});

app.delete("/users/:id", async (req, res) => {
    const deleted = await User.destroy({
        where: {
            id: req.params.id
        }
    });
    res.sendStatus(200);
});


// Matcher Routes
app.post("/users/:id/matcher", async (req, res) => {
    const createdMatcher = await Matcher.create(req.body);
    await User.findByPk(req.params.id)
        .then(user => user.addMatcher(createdMatcher));
    res.json(createdMatcher);
});

app.delete("/users/:userId/matcher/:matcherId", async (req, res) => {
    await Matcher.destroy({
        where: {
            id: req.params.matcherId,
            userId: req.params.userId
        }
    });
    res.sendStatus(200);
});

app.put("/users/:userId/matcher/:matcherId", async (req, res) => {
    const matcher = await Matcher.findOne({
        where: {
            id: req.params.matcherId,
            userId: req.params.userId
        }
    });
    const updatedMatcher = await matcher.update(req.body);
    res.json(updatedMatcher);
});

// Match Route
app.get("/users/:userId/matcher/:matcherId/match", async (req, res) => {
    const user = await User.findByPk(req.params.userId);
    const userMatcher = await Matcher.findByPk(req.params.matcherId);
    const match = await Matcher.findOne({
        where: {
            userId: { [Op.ne]: userMatcher.UserId},
            platform: userMatcher.platform,
            gameName: userMatcher.gameName
        }
    });
    res.json({userMatcher, match});
});

// Party routes
app.delete("/party/:partyId", async(req, res) => {
    await Party.destroy({
        where: {
            id: req.params.partyId
        }
    });
    res.sendStatus(200);
});

// Return
module.exports = app;