const userRouter = require('./users/users')
const matcherRouter = require('./matchers/matchers')
const partyRouter = require('./party/party')
const messageRouter = require('./messages/messages')

module.exports = {
  userRouter,
  matcherRouter,
  partyRouter,
  messageRouter
}
