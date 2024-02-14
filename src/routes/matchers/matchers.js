const express = require('express')
const { User, Matcher } = require('../../../models')
const { matchFinder } = require('../../util')

const { requiresAuth } = require('express-openid-connect')

const router = express.Router()

// Find all machers
router.get('/', requiresAuth(), async (req, res, next) => {
  // REFACTOR
  const { sub } = req.oidc.user
  const userId = sub.split('|')[1]
  try {
    const user = await User.findOne({
      where: {
        userId: userId
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

// Create a new Matcher and associate a User (creator)
router.post('/', requiresAuth(), async (req, res, next) => {
  const { nickname, sub } = req.oidc.user
  const { matcher } = req.body

  const userId = sub.split('|')[1]
  //TODO Add error handling to ensure body is not empty or
  // has the incorrect values
  try {
    // Find the user in the db
    const creator = await User.findOne({
      where: {
        userId: userId,
        userName: nickname
      }
    })

    if (!creator) {
      return res.sendStatus(404)
    }

    // Create new Matcher and associate the user
    const newMatcher = await Matcher.create(matcher)
    // TODO add error handling here in case matcher does not match Matcher schema
    await newMatcher.setUser(creator)

    // TODO See if UserId can be assigned in the lines above to avoid finding ther user AGAIN
    // Find the newly created matcher along with the user who created
    const returnMatcher = await Matcher.findByPk(newMatcher.id, {
      include: {
        model: User
      }
    })

    // Find similar matcher
    let party = await matchFinder(returnMatcher, creator)

    if (!party) {
      return res.status(201).send({ matcher: returnMatcher })
    }

    res.status(201).send({ party: party })
  } catch (err) {
    next(err)
  }
})

// Delete a Matcher
router.delete('/:id', requiresAuth(), async (req, res, next) => {
  const { id } = req.params
  try {
    const matcherToDestroy = await Matcher.findByPk(id)
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
router.put('/:id', requiresAuth(), async (req, res, next) => {
  const { id } = req.params
  const { updates } = req.body
  // TODO Need to update with platform as well
  const { objective, note } = updates
  try {
    const matcherToUpdate = await Matcher.findByPk(id)
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
