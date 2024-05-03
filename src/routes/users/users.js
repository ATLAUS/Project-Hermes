const express = require('express')
const { User, Party } = require('../../../models')
const router = express.Router()

// Find all users (for testing purposes).
router.get('/all', async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: {
        model: Party
      }
    })
    if (users.length < 1) {
      return res.sendStatus(404)
    }
    res.send({ users })
  } catch (error) {
    next(error)
  }
})

// Find user by ID.
router.get('/user-info', async (req, res, next) => {
  const { id } = req.user
  try {
    const user = await User.findOne({
      where: {
        id: id
      },
      include: {
        model: Party
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
