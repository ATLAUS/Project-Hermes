const express = require('express')
const { User, Matcher, Party } = require('../../../models')

const router = express.Router()

router.get('/:id', async (req, res, next) => {
    const { id } = req.params
    try {
        const user = await User.findByPk(id)

        const userParties = await user.getParties()
        if (userParties < 1){
            return res.sendStatus(404)
        }

        res.send({parties: userParties})
    } catch (error) {
        next(error)
    }
})

module.exports = router
