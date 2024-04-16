const { users, matchers } = require('./seedData')
const { db } = require('./connection')
const { User, Matcher, Party } = require('../models')

const seed = async () => {
  try {
    await db.sync({ force: true })

    const createdUsers = await Promise.all(
      users.map((user) => User.create(user))
    )
    const createdMatchers = await Promise.all(
      matchers.map((matcher) => Matcher.create(matcher))
    )
    const createdParty = await Party.create({ gameName: 'Palworld' })

    createdUsers[0].addMatcher([createdMatchers[0]])
    createdUsers[1].addMatcher([createdMatchers[1]])
    createdUsers[2].addMatcher([createdMatchers[2]])
    createdUsers[3].addMatcher([createdMatchers[3]])
    await createdParty.addUsers([createdUsers[0], createdUsers[1]])
    await createdParty.addMatchers([createdMatchers[0], createdMatchers[1]])

    await createdMatchers[0].update({ activeParty: true })
    await createdMatchers[1].update({ activeParty: true })

    await createdUsers[0].update({ activeParty: true })
    await createdUsers[1].update({ activeParty: true })
    console.log('db populated!')
  } catch (error) {
    console.error(error)
  }
}

// UNCOMMENT WHEN DONE TESTING
// seed()

module.exports = { seed }
