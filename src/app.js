require('dotenv').config('.env')
const { userRouter, matcherRouter, partyRouter } = require('./routes')
const express = require('express')
const app = express()
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

// Party routes
app.use('/parties', partyRouter)

module.exports = app
