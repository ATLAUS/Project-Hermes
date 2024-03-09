const { User } = require('./User')
const { Matcher } = require('./Matcher')
const { Party } = require('./Party')

User.hasMany(Matcher, {
  onDelete: 'CASCADE'
})
Matcher.belongsTo(User)

Party.hasMany(Matcher)
Matcher.belongsTo(Party)

User.belongsToMany(Party, { through: 'User_Party' })
Party.belongsToMany(User, { through: 'User_Party' })

module.exports = {
  User,
  Matcher,
  Party
}
