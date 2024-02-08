const express = require('express')
const { User, Matcher } = require('../../../models')

const router = express.Router()

// Find all machers
router.get('/', async (req, res, next) => {
  try {
    const matchers = await Matcher.findAll()
    if (matchers.length < 1) {
      return res.sendStatus(404)
    }
    res.send({ matchers })
  } catch (err) {
    next(err)
  }
})

// Create a new Matcher and associate a User (creator)
router.post('/', async (req, res, next) => {
  const { user, matcher } = req.body
  //TODO Add error handling to ensure body is not empty or
  // has the incorrect values
  try {
    // Find the user in the db
    const creator = await User.findOne({
      where: {
        userId: user.userId,
        userName: user.userName
      }
    })

    // Create new matcher and associate the user
    const newMatcher = await Matcher.create(matcher)
    // TODO add error handling here in case matcher does not match Matcher schema
    await newMatcher.setUser(creator)

    // Find the newly created matcher along with the user who created
    const returnMatcher = await Matcher.findByPk(newMatcher.id, {
      include: {
        model: User
      }
    })

    res.status(201).send({ matcher: returnMatcher })
  } catch (err) {
    next(err)
  }
})

module.exports = router
