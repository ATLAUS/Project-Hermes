const express = require('express')
const { User, Party, Message, Chat } = require('../../../models')

const router = express.Router()

// TODO Get chat associated with a users party
router.get('/:partyId', async (req, res, next) => {
  try {
    const { partyId } = req.params
    const associatedChat = await Party.findByPk(partyId, {
      include: {
        model: Chat
      }
    })

    const messages = await associatedChat.Chat.getMessages()

    if (messages.length > 0) {
      return res.send({ messages })
    }
    // TODO Figure out what to send if there are no messages.
    // IDEA: empty array and check it on the client side.
    next()
  } catch (error) {
    next(error)
  }
})

module.exports = router
