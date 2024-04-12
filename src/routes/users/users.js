const express = require('express')
const { User } = require('../../../models')
const router = express.Router()

// Find all users (for testing purposes).
router.get('/all', async (req, res, next) => {
  try {
    const users = await User.findAll()
    if (users.length < 1) {
      return res.sendStatus(404)
    }
    res.send({ users })
  } catch (error) {
    next(error)
  }
})

// Find user by ID.
router.get('/', async (req, res, next) => {
  const { id } = req.user
  try {
    const user = await User.findOne({
      where: {
        id: id
      }
    })
    if (!user) {
      return res.sendStatus(404)
    }
    res.send({ user })
  } catch (error) {
    next(error)
  }
})

// Delete a user by id.
router.delete('/', async (req, res, next) => {
  const { id } = req.user
  try {
    const userToDelete = await User.destroy({
      where: {
        id: id
      }
    })
    if (!userToDelete) {
      return res.sendStatus(404)
    }
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
})
module.exports = router
