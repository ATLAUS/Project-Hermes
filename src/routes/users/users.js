const express = require('express')
const { User } = require('../../../models')

const router = express.Router()

router.get('/', async(req, res, next) => {
    try {
        const users = await User.findAll()
        if (users.length < 1){
            res.sendStatus(404)
        }
        res.send({ users: users })
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async(req, res, next) => {
    const { id } = req.params
    try {
        const user = await User.findOne({
            where: {
                userId: id
            }
        })
        if (!user) {
          res.sendStatus(404)
        }
        res.send({user: user})
    } catch (err) {
        next(err)
    }
})

module.exports = router
