const { userRouter, matcherRouter, partyRouter } = require('./routes')
const express = require('express')
const app = express()

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
