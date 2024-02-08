const { describe, test, expect,beforeAll } = require('@jest/globals')
const {db} = require('../db/connection') 
const {User, Matcher, Party} = require('../models')
const request = require('supertest')
const app = require('../src/app')

const testUsers = [
    {
        userId: '123123',
        userName: "Daniel",
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
    userName: 'Bobert',
}

beforeAll(async() => {
    await db.sync({ force: true })
    await User.bulkCreate(testUsers)
    await Matcher.bulkCreate(testMatchers)  
})

describe('User routes', () => {
    test('GET /users', async () => {
        const res = await request(app).get("/users")

        expect(res.statusCode).toBe(200)
        expect(res.body.users.length).toBe(testUsers.length)
        expect(res.body.users[0]).toEqual(expect.objectContaining(testUsers[0]))
    })

    test('GET /users/id', async () => {
        const res = await request(app).get('/users/123123')

        expect(res.statusCode).toBe(200)
        expect(res.body.user).toEqual(expect.objectContaining(testUsers[0]))
    })

    test('GET /users/id where user does not exist', async() => {
        const res = await request(app).get('/users/545544')

        expect(res.statusCode).toBe(404)
        expect(res.error.text).toBe("Not Found")
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
        expect(res.error.text).toBe("Bad Request")
    })

    test('POST /users but no user is provided', async() => {
        const res = await request(app).post('/users')

        expect(res.statusCode).toBe(400)
        expect(res.error.text).toBe("Bad Request")
    })

    test('DELETE /users/id', async() => {
        const res = await request(app).delete(`/users/${newUser.userId}`)

        expect(res.statusCode).toBe(200)
    })

    test('DELETE /users/id but the user does not exist in the db', async() => {
        const res = await request(app).delete(`/users/${newUser.userId}`)

        expect(res.statusCode).toBe(404)
        expect(res.error.text).toBe('Not Found')
    })
})