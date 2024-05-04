require('dotenv').config('.env')
const cors = require('cors')
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const { auth } = require('express-oauth2-jwt-bearer')
const { userAuth } = require('./middleware')
const { userRouter, matcherRouter, partyRouter } = require('./routes')
const { AUTH0_SECRET, AUTH0_AUDIENCE, AUTH0_BASE_URL, AUTH0_SIGNING_ALGO } =
  process.env

const jwtCheck = auth({
  secret: AUTH0_SECRET,
  audience: AUTH0_AUDIENCE,
  issuerBaseURL: AUTH0_BASE_URL,
  tokenSigningAlg: AUTH0_SIGNING_ALGO
})

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173'
  }
})

app.use(cors())
app.use(jwtCheck)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(userAuth)

// TODO Delete once route implementation on the frontend begins.
// FOR DEMO.
app.get('/test', (req, res, next) => {
  res.send({ msg: 'Hello World' })
})

// User routes (mainly for manual testing).
app.use('/api/users', userRouter)

// Matcher routes.
app.use('/api/matchers', matcherRouter)

// Party routes.
app.use('/api/parties', partyRouter)

// Websocket implementation.
//Socket Middleware to validate that user a member of the party id sent from the client.
io.use((socket, next) => {
  // Query party here.
  console.log(socket.id)
  const { userId, partyId } = socket.handshake.auth

  next()
})

io.on('connect', (socket) => {
  console.log('New socket connection established!')

  socket.on('send-message', (args) => {
    console.log(args)
    io.emit('message', args)
  })
})

module.exports = {
  httpServer
}
