const express = require('express')
const { User } = require('../../../models')

const router = express.Router()

router.get('/', async(req, res, next) => {
    try {
        const users = await User.findAll()
        if (users.length < 1){
           return res.sendStatus(404)
        }
        res.send({ users: users })
    } catch (err) {
        next(err)
    }

})


module.exports = router
