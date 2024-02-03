const express = require("express");
const app = express();
const { User } = require("../models/User")
const { db } = require("../db/connection");
const { check, validationResult } = require('express-validator')

app.use(express.json());
app.use(express.urlencoded());

// User routes (mainly for manual testing)
app.get("/users", async(req, res) => {
    const allUsers = await User.findAll();
    res.send(allUsers)
})

app.get("/users/:id", async(req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    res.send(user);
});

app.post("/users", async (req, res) => {
    const createdUser = await User.create(req.body);
    res.json(createdUser)
})

app.delete("/users/:id", async (req, res) => {
    const deleted = await User.destroy({
        where: {
            id: req.params.id
        }
    })
    res.sendStatus(200)
});


// Matcher Routes

module.exports = app;