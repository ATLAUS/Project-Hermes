const { describe, test, expect, beforeAll } = require('@jest/globals')
const { db } = require('../db/connection')
const { User, Matcher, Party } = require('../models')
const request = require('supertest')
const app = require('../src/app')

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

const testMatchers = [
  {
    // Chravis
    gameName: 'Palworld',
    platform: 'PC',
    objective: 'grind',
    note: 'Looking to farm supplies.'
  },
  {
    // Bobert
    gameName: 'Palworld',
    platform: 'PC',
    objective: 'grind',
    note: 'Boss fights.'
  },
  {
    // Chrevor
    gameName: 'Escape from Tarkov',
    platform: 'PC',
    objective: 'grind',
    note: 'Need Roubles.'
  }
]

const newUser = {
  userId: '123126',
  userName: 'chracy',
  email: 'chracy@hotmail.com'
}

//Mock auth0
jest.mock('express-openid-connect', () => ({
  auth: jest.fn(() => {
    return (req, res, next) => {
      next()
    }
  }),
  requiresAuth: jest.fn(() => {
    return (req, res, next) => {
      const [_, nickname, sub, email] = req.headers.authorization.split(' ')
      req.oidc = { user: { nickname, sub, email } }
      next()
    }
  })
}))

beforeAll(async () => {
  await db.sync({ force: true })
  // Create users and their matchers
  const [chravis, bobert, chrevor] = await User.bulkCreate(testUsers)
  const [palOne, palTwo, tarkOne] = await Matcher.bulkCreate(testMatchers)

  // Add matchers to designated user
  await chravis.addMatcher(palOne)
  await bobert.addMatcher(palTwo)
  await chrevor.addMatcher(tarkOne)
})

describe('User routes', () => {
  test('GET /users', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer nickname email sub`)

    expect(res.statusCode).toBe(200)
    expect(res.body.users.length).toBe(testUsers.length)
    expect(res.body.users[0]).toEqual(expect.objectContaining(testUsers[0]))
  })

  test('GET /users/id', async () => {
    const res = await request(app)
      .get('/users/123123')
      .set('Authorization', `Bearer nickname email sub`)

    expect(res.statusCode).toBe(200)
    expect(res.body.user).toEqual(expect.objectContaining(testUsers[0]))
  })

  test('GET /users/id where user does not exist', async () => {
    const res = await request(app)
      .get('/users/545544')
      .set('Authorization', `Bearer nickname email sub`)

    expect(res.statusCode).toBe(404)
    expect(res.error.text).toBe('Not Found')
  })

  test('POST /users', async () => {
    const res = await request(app)
      .post('/users')
      .set(
        'Authorization',
        `Bearer ${newUser.userName} |${newUser.userId} ${newUser.email}`
      )

    expect(res.statusCode).toBe(201)
  })

  test('POST /users but user already exists', async () => {
    // Saving one of the users from the test users array into a new variable
    const user = testUsers[0]

    const res = await request(app)
      .post('/users')
      .set(
        'Authorization',
        `Bearer ${user.userName} |${user.userId} ${user.email}`
      )

    expect(res.statusCode).toBe(400)
    expect(res.error.text).toBe('Bad Request')
  })

  test('POST /users but no user is provided', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', `Bearer nickname email sub`)

    expect(res.statusCode).toBe(400)
    expect(res.error.text).toBe('Bad Request')
  })

  test('DELETE /users/id', async () => {
    const res = await request(app)
      .delete(`/users/${newUser.userId}`)
      .set('Authorization', `Bearer nickname email sub`)

    expect(res.statusCode).toBe(200)
  })

  test('DELETE /users/id but the user does not exist in the db', async () => {
    const res = await request(app)
      .delete(`/users/${newUser.userId}`)
      .set('Authorization', `Bearer nickname email sub`)

    expect(res.statusCode).toBe(404)
    expect(res.error.text).toBe('Not Found')
  })
  // TODO add delete test to validate that deleting a user will cascade to their matchers
})

describe('Matcher routes', () => {
  test('GET /matchers', async () => {
    const res = await request(app)
      .get('/matchers')
      .set(
        'Authorization',
        `Bearer ${testUsers[0].userName} |${testUsers[0].userId} ${testUsers[0].email}`
      )

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.matchers)).toBe(true)
    expect(res.body.matchers[0]).toEqual(
      expect.objectContaining(testMatchers[0])
    )
  })

  test('POST /matchers and create a party if other matcher exists', async () => {
    // Get user chravis from the db to use to test matcher creation
    const user = await User.findByPk(1)

    const chravis = testUsers[0]

    const newMatcher = {
      gameName: 'Escape from Tarkov',
      platform: 'PC',
      objective: 'grind',
      note: 'Questing!'
    }

    const res = await request(app)
      .post('/matchers')
      .send({
        user: chravis,
        matcher: newMatcher
      })
      .set(
        'Authorization',
        `Bearer ${user.userName} |${user.userId} ${user.email}`
      )

    expect(res.statusCode).toBe(201)
    expect(res.body.party.Users[0]).toEqual(
      expect.objectContaining(testUsers[0])
    )
    expect(res.body.party.Users[0].id).toBe(user.id)
  })

  test('POST /matchers and return newly created matcher because no match was found', async () => {
    // Get user chravis from the db to use to test matcher creation
    const user = await User.findByPk(1)

    const chravis = testUsers[0]

    const newMatcher = {
      gameName: 'EA FC',
      platform: 'PC',
      objective: 'casual',
      note: 'Looking to run some pro clubs'
    }

    const res = await request(app)
      .post('/matchers')
      .send({
        user: chravis,
        matcher: newMatcher
      })
      .set(
        'Authorization',
        `Bearer ${user.userName} |${user.userId} ${user.email}`
      )

    expect(res.statusCode).toBe(201)
    expect(res.body.matcher).toEqual(expect.objectContaining(newMatcher))
    expect(res.body.matcher.User.id).toBe(user.id)
  })
  // TODO Add post test if matcher or user is not provided

  test('DELETE /matchers/id', async () => {
    // Create the matcher to delete
    const bobert = await User.findOne({
      where: {
        // Picking bobert's id from the testUsers array
        userId: testUsers[1].userId
      }
    })

    const newMatcher = {
      gameName: 'Call of Duty',
      platform: 'PC',
      objective: 'grind',
      note: 'Questing!'
    }

    const matcherToDestroy = await Matcher.create(newMatcher)
    await matcherToDestroy.setUser(bobert)

    const res = await request(app)
      .delete(`/matchers/${matcherToDestroy.id}`)
      .set(
        'Authorization',
        `Bearer ${bobert.userName} |${bobert.userId} ${bobert.email}`
      )

    expect(res.statusCode).toBe(200)
  })
  // TODO Add delete test for an id that doesn't exist

  test('PUT /matchers/id', async () => {
    // Create matcher to update
    const chrevor = await User.findOne({
      where: {
        userId: testUsers[2].userId
      }
    })

    const newMatcher = {
      gameName: 'Rust',
      platform: 'PC',
      objective: 'Farm',
      note: 'Looking to cook up some iron.'
    }

    const updates = {
      objective: 'grind',
      note: 'Need to raid.'
    }

    const matcherToUpdate = await Matcher.create(newMatcher)
    await matcherToUpdate.setUser(chrevor)

    const res = await request(app)
      .put(`/matchers/${matcherToUpdate.id}`)
      .send({
        updates
      })
      .set('Authorization', `Bearer nickname email sub`)

    const matcherValidation = await Matcher.findByPk(matcherToUpdate.id)

    expect(res.statusCode).toBe(200)
    expect(matcherValidation).toEqual(expect.objectContaining(updates))
  })
  // TODO Add put test for an id that doesn't exist
})

describe('Party routes', () => {
  test('GET /parties to see a users active parties', async () => {
    // Get PK or id for user in the db
    const chrevor = await User.findOne({
      where: {
        userId: testUsers[2].userId
      }
    })

    const res = await request(app)
      .get(`/parties/${chrevor.id}`)
      .set('Authorization', `Bearer nickname email sub`)

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.parties)).toBe(true)
  })

  test('GET /parties for a user not in a party', async () => {
    // Get PK or id for user in the db
    const bobert = await User.findOne({
      where: {
        userId: testUsers[1].userId
      }
    })

    const res = await request(app)
      .get(`/parties/${bobert.id}`)
      .set('Authorization', `Bearer nickname email sub`)

    expect(res.statusCode).toBe(404)
  })
})
