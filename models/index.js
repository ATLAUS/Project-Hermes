const { User } = require('./User')
const { Matcher } = require('./Matcher')
const { Party } = require('./Party')

// Need to refactor
User.belongsToMany(Matcher, {through: Party})
Matcher.belongsToMany(User, { through: Party})

module.exports = {
    User,
    Matcher,
    Party
}