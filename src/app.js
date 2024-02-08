const { userRouter, matcherRouter, partyRouter } = require('./routes')
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// User routes (mainly for manual testing)
app.use('/users', userRouter)

// Matcher routes
app.use('/matchers', matcherRouter)

// Party routes
app.use('/parties', partyRouter)

module.exports = app
