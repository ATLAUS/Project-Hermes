require('dotenv').config('.env')
const { userRouter, matcherRouter, partyRouter } = require('./routes')
const express = require('express')
const app = express()
const { auth } = require('express-openid-connect')
const { userAuth } = require('./middleware')

const { AUTH0_SECRET, AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_BASE_URL } =
  process.env

const config = {
  authRequired: true,
  auth0Logout: true,
  secret: AUTH0_SECRET,
  baseURL: AUTH0_AUDIENCE,
  clientID: AUTH0_CLIENT_ID,
  issuerBaseURL: AUTH0_BASE_URL
}

app.use(auth(config))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(userAuth)

// User routes (mainly for manual testing)
app.use('/api/users', userRouter)

// Matcher routes
app.use('/api/matchers', matcherRouter)

// Party routes
app.use('/api/parties', partyRouter)

module.exports = app
