const express = require('express')
const { User, Matcher } = require('../../../models')
const { MatchFinder } = require('../../util')

const router = express.Router()

// Find all matcher belonging to signed in user.
router.get('/', async (req, res, next) => {
  // REFACTOR
  const userId = req.user.id
  try {
    const user = await User.findOne({
      where: {
        id: userId
      },
      include: {
        model: Matcher
      }
    })

    if (user.Matchers.length < 1) {
      return res.sendStatus(404)
    }

    res.send({ matchers: user.Matchers })
  } catch (err) {
    next(err)
  }
})

// Create a new Matcher and associate a User (creator).
router.post('/', async (req, res, next) => {
  const { userId, userName } = req.user
  //TODO Add error handling to ensure body is not empty or
  // has the incorrect values.
  const { matcher } = req.body

  try {
    // Find the user in the db.
    const creator = await User.findOne({
      where: {
        userId: userId,
        userName: userName
      }
    })

    if (!creator) {
      return res.sendStatus(404)
    }

    // Create new Matcher and associate the user.
    const newMatcher = await Matcher.create(matcher)
    await newMatcher.setUser(creator)

    // Find the newly created matcher along with the user who created it.
    const returnMatcher = await Matcher.findByPk(newMatcher.id, {
      include: {
        model: User
      }
    })

    // Find similar matcher and create the Party.
    let party = await MatchFinder(returnMatcher, creator)

    if (!party) {
      return res.status(201).send({ matcher: returnMatcher })
    }

    // TODO edit party object sent.
    res.status(201).send({ party: party })
  } catch (err) {
    next(err)
  }
})

// Delete a Matcher by their ID.
router.delete('/:matcherId', async (req, res, next) => {
  const { matcherId } = req.params
  try {
    const matcherToDestroy = await Matcher.findByPk(matcherId)
    if (!matcherToDestroy) {
      return res.sendStatus(404)
    }
    await matcherToDestroy.destroy()
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})

// Update a Matcher
router.put('/:matcherId', async (req, res, next) => {
  const { matcherId } = req.params
  const { updates } = req.body
  // TODO Need to update with platform as well.
  const { objective, note } = updates
  try {
    const matcherToUpdate = await Matcher.findByPk(matcherId)
    if (!matcherToUpdate) {
      return res.sendStatus(404)
    }

    await matcherToUpdate.update({
      ...matcherToUpdate,
      objective,
      note
    })
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})

module.exports = router
