const express = require('express')
const { User } = require('../../../models')

const router = express.Router()

// Find all users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll()
    if (users.length < 1) {
      return res.sendStatus(404)
    }
    res.send({ users })
  } catch (err) {
    next(err)
  }
})

// Find user by ID
router.get('/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    const user = await User.findOne({
      where: {
        userId: id
      }
    })
    if (!user) {
      return res.sendStatus(404)
    }
    res.send({ user: user })
  } catch (err) {
    next(err)
  }
})

// Create a new user if user does not already exist
//TODO Need to add proper validation to verify that a user is in the req.body
router.post('/', async (req, res, next) => {
  const user = req.body
  // TODO fix this validation
  if (JSON.stringify(user) === '{}') {
    return res.sendStatus(400)
  }
  try {
    // Check and see if the user already exists in the db
    // TODO See if findorcreate would make more sense
    let userCheck = await User.findOne({
      where: {
        userId: user.userId
      }
    })

    // If a userCheck comes back null because a user does not exist in the db
    // A new one is created. ELSE the user does exist in the db and we dont create a new one
    if (userCheck === null) {
      let newUser = await User.create(user)
      return res.sendStatus(201)
    }
    return res.sendStatus(400)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    const userToDelete = await User.destroy({
      where: {
        userId: id
      }
    })
    if (!userToDelete) {
      return res.sendStatus(404)
    }
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})
module.exports = router
