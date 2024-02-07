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

beforeAll(async() => {
    await db.sync({ force: true })
    await User.bulkCreate(testUsers)
    await Matcher.bulkCreate(testMatchers)  
})

describe('User routes', () => {
    test('GET /Users', async () => {
        const res = await request(app).get("/users")

        expect(res.statusCode).toBe(200)
        expect(res.body.users.length).toBe(testUsers.length)
        expect(res.body.users[0]).toEqual(expect.objectContaining(testUsers[0]))
    })

    test('GET /Users/id', async () => {
        const res = await request(app).get('/users/123123')

        expect(res.statusCode).toBe(200)
        expect(res.body.user).toEqual(expect.objectContaining(testUsers[0]))
    })

    test('GET /Users/id where user does not exist', async() => {
        const res = await request(app).get('/users/545544')

        expect(res.statusCode).toBe(404)
        expect(res.error.text).toBe("Not Found")
    })
})