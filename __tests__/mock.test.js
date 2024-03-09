const { describe, test, expect, beforeAll } = require('@jest/globals')
const { db } = require('../db/connection')
const { User, Matcher, Party } = require('../models')
const request = require('supertest')
const app = require('../src/app')

// Mock auth0 "auth" functionality.
jest.mock('express-openid-connect', () => ({
  auth: jest.fn(() => {
    return (req, res, next) => {
      next()
    }
  })
}))

// Mock custom "userAuth" middleware function.
jest.mock('../src/middleware', () => ({
  userAuth: jest.fn(async (req, res, next) => {
    const [_, nickname, sub, email] = req.headers.authorization.split(' ')
    const id = parseInt(sub.split('|')[1])
    req.user = { nickname, id, email }
    next()
  })
}))

const testUsers = [
  {
    userId: '123123',
    userName: 'chravis',
    email: 'chravis2007@gmail.com'
  },
  {
    userId: '123124',
    userName: 'bobert15',
    email: 'bobert15@hotmail.com'
  },
  {
    userId: '123125',
    userName: 'chrevor007',
    email: 'chrevor007@mailchimp.com'
  }
]

beforeAll(async () => {
  await db.sync({ force: true })
  const [chravis, bobert, chrevor] = await User.bulkCreate(testUsers)
})

describe('User routes', () => {
  test('GET /api/users should return user details', async () => {
    const testUser = {
      id: 1,
      userName: 'chravis',
      userId: '123123',
      email: 'chravis2007@gmail.com',
      activeParty: false
    }

    const res = await request(app)
      .get('/api/users')
      .set(
        'Authorization',
        `Bearer ${testUser.userName} |${testUser.id} ${testUser.email}`
      )

    expect(res.statusCode).toBe(200)
    expect(res.body.user).toEqual(expect.objectContaining(testUser))
  })
})
