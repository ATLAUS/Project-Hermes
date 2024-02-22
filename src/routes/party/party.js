const express = require('express')
const { User, Matcher, Party } = require('../../../models')

const router = express.Router()
const { requiresAuth } = require('express-openid-connect')
const { matchFinder } = require('../../util')
const { Op } = require('@sequelize/core')

router.get('/', requiresAuth(), async (req, res, next) => {
  // Userid
  const userId = req.user.id
  try {
    const user = await User.findByPk(userId)

    const userParties = await user.getParties()
    if (userParties < 1) {
      return res.sendStatus(404)
    }

    res.send({ parties: userParties })
  } catch (error) {
    next(error)
  }
})

router.put("/leave/:partyId", async (req, res, next) => {
  try {
      // Find Party
    const party = await Party.findByPk(req.params.partyId, {
      include: [
        {
          model: User,
          attributes: ['id']
        }
      ]
    })

    if (!party) {
      return res.sendStatus(404)
    }

    // Change active field to false
    await party.update({active: false})

    // Find user1 
    const user1 = await User.findByPk(party.Users[0].id)
    // Find user2
    const user2 = await User.findByPk(party.Users[1].id)
    
    await user1.update({activeParty: false})
    await user2.update({activeParty: false})

    res.sendStatus(200)

  } catch (error) {
    next(error)
  }
})

router.put("/rematch/:partyId", async (req, res, next) => {
  try {
      // Find Party
    const party = await Party.findByPk(req.params.partyId, {
      include: [
        {
          model: User,
          attributes: ['id']
        },
        {
          model: Matcher
        }
      ]
    })

    if (!party) {
      return res.sendStatus(404)
    }

    // Find user1 
    const user1 = await User.findByPk(req.user.id)
    // Find user2
    const user2 = await User.findByPk(party.Users[1].id)

    let matcher

    for (let i = 0; i < party.Matchers.length; i ++) {
      if (party.Matchers[i].UserId == req.user.id) {
        matcher = party.Matchers[i]
        party.Matchers.splice(i, 1)
        break
      }
    }

    let newParty = await matchFinder(matcher, user1)
    if (!newParty) {
      return res.status(404).send({"message" : "No match found dawg."})
    }

    await party.update({active: false}) // Change active field to false
    await user2.update({activeParty: false}) // Change the other User's activeParty field to false
    await party.Matchers[0].update({activeParty: false})

    res.status(201).send({party: newParty})

  } catch (error) {
    next(error)
  }
})


module.exports = router
