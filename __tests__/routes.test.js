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
        userName: 'Daniel'
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
    const [daniel, senai, aaron] = await User.bulkCreate(testUsers)
    const [palOne, palTwo, tark] = await Matcher.bulkCreate(testMatchers)

})

describe('User routes', () => {
    test('GET /Users', async () => {
        const res = await request(app).get("/users")



        console.log(JSON.stringify(res.body, 0, 2))
    })
})