const { User, Matcher, Party, Chat } = require('../../models')
const { Op } = require('@sequelize/core')

// ActiveParty assignment.
const setActiveParty = async (modelArr) => {
  for (const model of modelArr) {
    await model.update({
      activeParty: true
    })
  }
}

// TODO if party size is added, will need to look for a party first
// with the same game name and check the amount of users associated with the party.
const MatchFinder = async (matcher, creator) => {
  const match = await Matcher.findOne({
    where: {
      userId: { [Op.ne]: creator.id },
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

  // TODO if a new party is create, a new CHAT needs to be created and associated as well
  const matchedUser = await User.findByPk(match.User.id)

  const newParty = await Party.create({
    gameName: matcher.gameName
  })

  const newChat = await Chat.create({
    gameName: matcher.gameName
  })

  await newParty.addUsers([creator, matchedUser])
  await newParty.addMatchers([matcher, match])

  // Associate chat to a party
  await newParty.setChat(newChat)
  await newChat.addUsers([creator, matchedUser])

  let modelArray = [matcher, match, creator, matchedUser]

  // TODO look at error handling.
  await setActiveParty(modelArray)

  const partyWithUsers = await Party.findByPk(newParty.id, {
    include: [{ model: User }, { model: Chat }]
  })
  return partyWithUsers
}

module.exports = {
  MatchFinder
}
