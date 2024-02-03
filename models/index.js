const { User } = require('./User')
const { Matcher } = require('./Matcher')
const { Party } = require('./Party')
const { MatcherParty } = require('./MatcherParty')

// Need to refactor
User.hasMany(Matcher); // User can have multiple Matchers
Matcher.belongsTo(User); // Matcher belongs to one User

MatcherParty.belongsTo(Matcher); // Matcher linked to specific criteria
MatcherParty.belongsTo(Party); // Party is formed based on matching criteria

User.belongsToMany(Party, { through: 'MatcherParty' }); // User joins parties through Matcher
Party.belongsToMany(User, { through: 'MatcherParty' }); // Party includes multiple users


module.exports = {
    User,
    Matcher,
    Party,
    MatcherParty,
}