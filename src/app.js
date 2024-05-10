require('dotenv').config('.env')
const cors = require('cors')
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const { auth } = require('express-oauth2-jwt-bearer')
const { userAuth } = require('./middleware')
const {
  userRouter,
  matcherRouter,
  partyRouter,
  messageRouter
} = require('./routes')
const { Party, User, Message } = require('../models')
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
    origin: [
      'http://localhost:5173',
      'https://atlaus-project-hermes.netlify.app'
    ]
  }
})

app.use(cors())
app.use(jwtCheck)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(userAuth)

// User routes (mainly for manual testing).
app.use('/api/users', userRouter)

// Matcher routes.
app.use('/api/matchers', matcherRouter)

// Party routes.
app.use('/api/parties', partyRouter)

// Message routes.
app.use('/api/messages/', messageRouter)

/*  WEBSOCKET IMPLEMENTATION */
// Socket Middleware to validate that user a member of the party id sent from the client.
io.use(async (socket, next) => {
  // Check that:
  // A) the requested party exists and
  // B) that the user is a member of the given party.
  const { userId, partyId, chatId } = socket.handshake.auth
  const partyToJoin = await Party.findByPk(partyId, {
    include: {
      model: User
    }
  })
  if (!partyToJoin) {
    return next(new Error('Invalid party ID.'))
  }

  for (let user of partyToJoin.Users) {
    if (user.userId === userId) {
      socket.roomId = partyId
      socket.userId = userId
      socket.chatId = chatId
      return next()
    }
  }

  next(new Error('User is not a member of given party.'))
})

io.on('connect', (socket) => {
  console.log('New socket connection established!')
  socket.join(socket.roomId.toString())
  console.log(`Connected ${socket.userId} to room ${socket.roomId}`)

  // Client sends a message
  socket.on('send-message', async ({ message, to, userId, chatId }) => {
    // Create a new message instance in the DB and associate the user and chat.
    const newMessage = await Message.create({
      message,
      UserId: userId,
      ChatId: chatId
    })

    // Send the newly created message to all connected clients.
    io.to(to.toString()).emit('return-message', {
      newMessage
    })
  })

  // Disconnection event
  socket.on('disconnect', (reason) => {
    console.log(reason)
  })
})

module.exports = {
  httpServer
}
