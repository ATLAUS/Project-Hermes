const express = require('express')
const { User } = require('../../../models')
const { requiresAuth } = require('express-openid-connect')

const router = express.Router()

// Find all users
router.get('/', requiresAuth(), async (req, res, next) => {
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

// Find user by ID
router.get('/:id', requiresAuth(), async (req, res, next) => {
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
  } catch (error) {
    next(error)
  }
})

// Create a new user if user does not already exist
//TODO Need to add proper validation to verify that user data is in the req.oidc.user
router.post('/', requiresAuth(), async (req, res, next) => {
  const { nickname, email, sub } = req.oidc.user

  console.log(req.oidc.user)
  const userId = sub.split('|')[1]

  try {
    // Check and see if the user already exists in the db
    // TODO See if findorcreate would make more sense
    let userCheck = await User.findOne({
      where: {
        userId: userId
      }
    })

    // If a userCheck comes back null because a user does not exist in the db
    // A new one is created. ELSE the user does exist in the db and we dont create a new one
    if (userCheck === null) {
      let newUser = await User.create({
        userId: userId,
        userName: nickname,
        email: email
      })
      return res.sendStatus(201)
    }
    return res.sendStatus(400)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', requiresAuth(), async (req, res, next) => {
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
  } catch (error) {
    next(error)
  }
})
module.exports = router
