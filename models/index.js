const { User } = require('./User')
const { Matcher } = require('./Matcher')
const { Party } = require('./Party')

// Need to refactor
User.hasMany(Matcher, {
  onDelete: 'CASCADE'
}) // User can have multiple Matchers
Matcher.belongsTo(User) // Matcher belongs to one User

Party.hasMany(Matcher)
Matcher.belongsTo(Party)

User.belongsToMany(Party, { through: 'User_Party' })
Party.belongsToMany(User, { through: 'User_Party' })

module.exports = {
  User,
  Matcher,
  Party

}
