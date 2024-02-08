const { userRouter, matcherRouter, partyRouter } = require('./routes')
const express = require('express')
const app = express()
// const { Op } = require('@sequelize/core')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// User routes (mainly for manual testing)
app.use('/users', userRouter)

// Matcher routes
app.use('/matchers', matcherRouter)

//Party routes
app.use('/parties', partyRouter)

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
