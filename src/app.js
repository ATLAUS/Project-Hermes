require('dotenv').config('.env')
const { userRouter, matcherRouter, partyRouter } = require('./routes')
const express = require('express')
const app = express()
const { auth } = require('express-oauth2-jwt-bearer')
const { userAuth } = require('./middleware')
const cors = require('cors')
const { AUTH0_SECRET, AUTH0_AUDIENCE, AUTH0_BASE_URL, AUTH0_SIGNING_ALGO } =
  process.env

const jwtCheck = auth({
  secret: AUTH0_SECRET,
  audience: AUTH0_AUDIENCE,
  issuerBaseURL: AUTH0_BASE_URL,
  tokenSigningAlg: AUTH0_SIGNING_ALGO
})

app.use(cors())
app.use(jwtCheck)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(userAuth)

// FOR DEMO
app.get('/test', (req, res, next) => {
  res.send({ msg: 'Hello World' })
})

// User routes (mainly for manual testing)
app.use('/api/users', userRouter)

// Matcher routes
app.use('/api/matchers', matcherRouter)

// Party routes
app.use('/api/parties', partyRouter)

module.exports = app
