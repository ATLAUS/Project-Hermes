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

    console.log(JSON.stringify(messages, 0, 2))
  } catch (error) {
    next(error)
  }
})

module.exports = router
