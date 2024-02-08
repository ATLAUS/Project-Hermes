require('dotenv').config('.env')
const { userRouter, matcherRouter } = require('./routes')
const express = require('express')
const app = express()
// const { Op } = require('@sequelize/core')
const { auth } = require('express-openid-connect')

const {
    AUTH0_SECRET,
    AUTH0_AUDIENCE,
    AUTH0_CLIENT_ID,
    AUTH0_BASE_URL,
} = process.env

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: AUTH0_SECRET,
    baseURL: AUTH0_AUDIENCE,
    clientID: AUTH0_CLIENT_ID,
    issuerBaseURL: AUTH0_BASE_URL,
}

app.use(auth(config))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// User routes (mainly for manual testing)
app.use('/users', userRouter)

// Matcher routes
app.use('/matchers', matcherRouter)

// // Matcher Routes

// app.delete("/users/:userId/matcher/:matcherId", async (req, res) => {
//     await Matcher.destroy({
//         where: {
//             id: req.params.matcherId,
//             userId: req.params.userId
//         }
//     });
//     res.sendStatus(200);
// });

// app.put("/users/:userId/matcher/:matcherId", async (req, res) => {
//     const matcher = await Matcher.findOne({
//         where: {
//             id: req.params.matcherId,
//             userId: req.params.userId
//         }
//     });
//     const updatedMatcher = await matcher.update(req.body);
//     res.json(updatedMatcher);
// });

// // Should be the party route and a post request because
// // ULTIMATLY whats happening is either a party gets created or not
// // Match Route
// app.get("/users/:userId/matcher/:matcherId/match", async (req, res) => {
//     const user1 = await User.findByPk(req.params.userId);
//     const userMatcher = await Matcher.findByPk(req.params.matcherId);
//     const match = await Matcher.findOne({
//         where: {
//             userId: { [Op.ne]: userMatcher.UserId},
//             platform: userMatcher.platform,
//             gameName: userMatcher.gameName
//         }
//     });
//     const user2 = await User.findByPk(match.dataValues.UserId);
//     const newParty = await Party.create({
//         gameName: userMatcher.gameName
//     });
//     newParty.addUser(user1);
//     newParty.addUser(user2);
//     res.json(newParty);
// });

// // Party routes
// app.delete("/party/:partyId", async(req, res) => {
//     await Party.destroy({
//         where: {
//             id: req.params.partyId
//         }
//     });
//     res.sendStatus(200);
// });

// Return
module.exports = app
