const { User, Matcher, Party } = require('../../models')
const { Op } = require('@sequelize/core')
// TODO add function to find matches upon matcher creation

// TODO if party size is added, will need to look for a party first
// with the same gamename and check the amount of users associated with the party
const matchFinder = async (matcher, creator) => {
  const match = await Matcher.findOne({
    where: {
      userId: { [Op.ne]: matcher.User.id },
      platform: matcher.platform,
      gameName: matcher.gameName,
      activeParty: false
    },
    include: {
      model: User
    }
  })
  if (!match) {
    return match
  }

  const matchedUser = await User.findByPk(match.User.id)

  const newParty = await Party.create({
    gameName: matcher.gameName
  })

  await newParty.addUsers([creator, matchedUser])

  // Set activeParty for matchers
  await matcher.update({
    activeParty: true
  })
  await match.update({
    activeParty: true
  })

  // Set activeParty status for users
  await creator.update({
    activeParty: true
  })

  await matchedUser.update({
    activeParty: true
  })

  const partyWithUsers = await Party.findByPk(newParty.id, {
    include: {
      model: User
    }
  })
  return partyWithUsers
}

module.exports = {
  matchFinder
}
