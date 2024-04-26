const { describe, test, expect, beforeAll } = require('@jest/globals')
const { User, Party, Message, Chat } = require('../models')
const { db } = require('../db/connection')
const { seed } = require('../db/seed')

// Global variables for association testing. Picking these
// values from the seed data.
let userOne
let userTwo
let userThree
let userFour
let party

beforeAll(async () => {
  await seed()
  // Assuming seeding went correctly and only 4 test users were created.
  const [testUserOne, testUserTwo, testUserThree, testUserFour] =
    await User.findAll()
  userOne = testUserOne
  userTwo = testUserTwo
  userThree = testUserThree
  userFour = testUserFour

  party = await Party.findOne({
    where: {
      gameName: 'Palworld'
    }
  })
})

describe('Messenger tests', () => {
  describe('model tests', () => {
    test('message instance can be created', async () => {
      const newMessage = {
        message: 'Test message'
      }
      const createdMessage = await Message.create(newMessage)

      expect(createdMessage).toBeInstanceOf(Message)
      expect(createdMessage).toEqual(expect.objectContaining(newMessage))
    })

    test('chat instance can be created', async () => {
      const newChat = {
        gameName: 'Escape from Tarkov'
      }

      const createdChat = await Chat.create(newChat)

      expect(createdChat).toBeInstanceOf(Chat)
      expect(createdChat).toEqual(expect.objectContaining(newChat))
    })
  })

  describe('association tests', () => {
    test('party gets a chat instance', async () => {
      // Validating the variables in the global scope for sanity check.
      expect(party).toBeInstanceOf(Party)

      const newChat = {
        gameName: 'Palworld'
      }
      const createdChat = await Chat.create(newChat)

      await createdChat.setParty(party)

      const partyWithChatAssociation = await Party.findByPk(party.id, {
        include: {
          model: Chat
        }
      })

      expect(partyWithChatAssociation).toBeInstanceOf(Party)
      expect(partyWithChatAssociation.Chat).toEqual(
        expect.objectContaining(newChat)
      )
    })

    test('users in party get added to chat', async () => {
      // Get the users in a party and add them to a chat.
      const partyWithUsers = await Party.findByPk(party.id, {
        include: {
          model: User
        }
      })

      // Destructure the users from the newly found party.
      const [chatUserOne, chatUserTwo] = partyWithUsers.Users

      const chat = await Chat.findOne({
        where: {
          gameName: partyWithUsers.gameName
        }
      })

      await chat.addUsers([chatUserOne, chatUserTwo])

      const chatWithUsers = await Chat.findByPk(chat.id, {
        include: {
          model: User
        }
      })

      expect(chatWithUsers).toBeInstanceOf(Chat)
      expect(Array.isArray(chatWithUsers.Users)).toBeTruthy()
    })

    test('message gets assigned a user and a chat', async () => {
      // Find the message created earlier in the test file.
      const message = await Message.findOne()

      // Find the chat created earlier in the test file.
      const chat = await Chat.findOne({
        where: {
          gameName: 'Palworld'
        }
      })
      await message.setUser(userOne)
      await chat.addMessage(message)

      const messageWithAssociations = await Message.findOne({
        include: [
          {
            model: Chat
          },
          {
            model: User
          }
        ]
      })

      expect(messageWithAssociations).toBeInstanceOf(Message)
      // TODO figure out how to validate that the user and chat
      // are infact what they should be. Right now can manually
      // validate by checking the db.
    })
  })
})
