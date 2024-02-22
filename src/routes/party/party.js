const express = require('express')
const { User, Matcher, Party } = require('../../../models')

const router = express.Router()
const { requiresAuth } = require('express-openid-connect')

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
    const user1 = await User.findByPk(party.Users[0].id, 
    //   {
    //   include: {
    //     model: Matcher,
    //     attributes: ['activeMatcher']
    //   }
    // }
    )
    // Find user2
    const user2 = await User.findByPk(party.Users[1].id,
    //   {
    //   include: {
    //     model: Matcher,
    //     attributes: ['activeMatcher']
    //   }
    // }
    )
    
    await user1.update({activeParty: false})
    await user2.update({activeParty: false})

    res.sendStatus(200)

  } catch (error) {
    next(error)
  }
})




module.exports = router
