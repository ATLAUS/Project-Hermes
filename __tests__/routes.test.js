const { describe, test, expect, beforeAll } = require('@jest/globals')
const { db } = require('../db/connection')
const { User, Matcher, Party } = require('../models')
const request = require('supertest')
const app = require('../src/app')

const testUsers = [
  {
    userId: '123123',
    userName: 'Daniel'
  },
  {
    userId: '123124',
    userName: 'Senai'
  },
  {
    userId: '123125',
    userName: 'Aaron'
  }
]

const testMatchers = [
  {
    // Daniel
    gameName: 'Palworld',
    platform: 'PC',
    objective: 'grind',
    note: 'Looking to farm supplies.'
  },
  {
    // Senai
    gameName: 'Palworld',
    platform: 'PC',
    objective: 'grind',
    note: 'Boss fights.'
  },
  {
    // Aaron
    gameName: 'Escape from Tarkov',
    platform: 'PC',
    objective: 'grind',
    note: 'Need Roubles.'
  }
]

const newUser = {
  userId: '123126',
  userName: 'Bobert'
}

beforeAll(async () => {
  await db.sync({ force: true })
  // Create users and their matchers
  const [daniel, senai, aaron] = await User.bulkCreate(testUsers)
  const [palOne, palTwo, tarkOne] = await Matcher.bulkCreate(testMatchers)

  // Add matchers to designated user
  await daniel.addMatcher(palOne)
  await senai.addMatcher(palTwo)
  await aaron.addMatcher(tarkOne)
})

describe('User routes', () => {
  test('GET /users', async () => {
    const res = await request(app).get('/users')

    expect(res.statusCode).toBe(200)
    expect(res.body.users.length).toBe(testUsers.length)
    expect(res.body.users[0]).toEqual(expect.objectContaining(testUsers[0]))
  })

  test('GET /users/id', async () => {
    const res = await request(app).get('/users/123123')

    expect(res.statusCode).toBe(200)
    expect(res.body.user).toEqual(expect.objectContaining(testUsers[0]))
  })

  test('GET /users/id where user does not exist', async () => {
    const res = await request(app).get('/users/545544')

    expect(res.statusCode).toBe(404)
    expect(res.error.text).toBe('Not Found')
  })

  test('POST /users', async () => {
    const res = await request(app).post('/users').send(newUser)

    expect(res.statusCode).toBe(201)
  })

  test('POST /users but user already exists', async () => {
    // Saving one of the users from the test users array into a new variable
    const user = testUsers[0]

    const res = await request(app).post('/users').send(user)

    expect(res.statusCode).toBe(400)
    expect(res.error.text).toBe('Bad Request')
  })

  test('POST /users but no user is provided', async () => {
    const res = await request(app).post('/users')

    expect(res.statusCode).toBe(400)
    expect(res.error.text).toBe('Bad Request')
  })

  test('DELETE /users/id', async () => {
    const res = await request(app).delete(`/users/${newUser.userId}`)

    expect(res.statusCode).toBe(200)
  })

  test('DELETE /users/id but the user does not exist in the db', async () => {
    const res = await request(app).delete(`/users/${newUser.userId}`)

    expect(res.statusCode).toBe(404)
    expect(res.error.text).toBe('Not Found')
  })
  // TODO add delete test to validate that deleting a user will cascade to their matchers
})

describe('Matcher routes', () => {
  test('GET /matchers', async () => {
    const res = await request(app).get('/matchers')

    expect(res.statusCode).toBe(200)
    expect(res.body.matchers.length).toBe(testMatchers.length)
    expect(res.body.matchers[0]).toEqual(
      expect.objectContaining(testMatchers[0])
    )
  })

  test('POST /matchers', async () => {
    //Get user Daniel from the db to use to test matcher creation
    const user = await User.findByPk(1)

    const daniel = testUsers[0]

    const newMatcher = {
      gameName: 'Escape from Tarkov',
      platform: 'PC',
      objective: 'grind',
      note: 'Questing!'
    }

    const res = await request(app).post('/matchers').send({
      user: daniel,
      matcher: newMatcher
    })

    expect(res.statusCode).toBe(201)
    expect(res.body.matcher).toEqual(expect.objectContaining(newMatcher))
    expect(res.body.matcher.User).toEqual(expect.objectContaining(testUsers[0]))
    expect(res.body.matcher.User.id).toBe(user.id)

    // console.log(JSON.stringify(res.body.matcher, 0, 2))
    // console.log(JSON.stringify(res.statusCode, 0, 2))
  })
  // TODO Add post test if matcher or user is not provided

  test('DELETE /matchers/id', async () => {
    // Create the matcher to delete
    const senai = await User.findOne({
      where: {
        // Picking Senai's id from the testUsers array
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
    await matcherToDestroy.setUser(senai)

    const res = await request(app).delete(`/matchers/${matcherToDestroy.id}`)
    // const res = await request(app).delete(`/matchers/8`)

    expect(res.statusCode).toBe(200)
  })
  // TODO Add delete test for an id that doesn't exist

  test('PUT /matchers/id', async () => {
    // Create matcher to update
    const aaron = await User.findOne({
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
    await matcherToUpdate.setUser(aaron)

    const res = await request(app).put(`/matchers/${matcherToUpdate.id}`).send({
      updates
    })

    const matcherValidation = await Matcher.findByPk(matcherToUpdate.id)

    expect(res.statusCode).toBe(200)
    expect(matcherValidation).toEqual(expect.objectContaining(updates))
  })
  // TODO Add put test for an id that doesn't exist
})
