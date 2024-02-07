const { User } = require('./User')
const { Matcher } = require('./Matcher')
const { Party } = require('./Party')
// const { UserParty } = require('./UserParty')

// Need to refactor
User.hasMany(Matcher); // User can have multiple Matchers
Matcher.belongsTo(User); // Matcher belongs to one User

// User.belongsToMany(Party, { through: 'UserParty' }); // User can join several parties
// Party.belongsToMany(User, { through: 'UserParty' }); // Party includes multiple users
User.belongsToMany(Party, { through: "User_Party"})
Party.belongsToMany(User, { through: "User_Party"})

module.exports = {
    User,
    Matcher,
    Party,
    // UserParty,
}