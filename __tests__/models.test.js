const { describe, test, expect, beforeAll } = require('@jest/globals')
const { User, Matcher, Party } = require('../models')
const { db } = require('../db/connection')

beforeAll( async() => {
   await db.sync({force:true})
})

describe('', () => {
    test('', async() => {


    })
})