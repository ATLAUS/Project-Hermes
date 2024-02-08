const express = require("express");
const app = express();
// const { Op } = require('@sequelize/core')

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

const userRouter = require('./routes/users/users')

// User routes (mainly for manual testing)
app.use('/users', userRouter);

// // Matcher Routes
// app.post("/users/:id/matcher", async (req, res) => {
//     const createdMatcher = await Matcher.create(req.body);
//     await User.findByPk(req.params.id)
//         .then(user => user.addMatcher(createdMatcher));
//     res.json(createdMatcher);
// });

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
module.exports = app;