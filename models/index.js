const { User } = require('./User')
const { Matcher } = require('./Matcher')
const { Party } = require('./Party')
const { Message } = require('./Message')
const { Chat } = require('./Chat')

User.hasMany(Matcher, {
  onDelete: 'CASCADE'
})
Matcher.belongsTo(User)

Party.hasMany(Matcher)
Matcher.belongsTo(Party)

User.belongsToMany(Party, { through: 'User_Party' })
Party.belongsToMany(User, { through: 'User_Party' })

// Messenger associations.
Party.hasOne(Chat)
Chat.belongsTo(Party)

User.hasMany(Message)
Message.belongsTo(User)

Chat.hasMany(Message)
Message.belongsTo(Chat)

Chat.belongsToMany(User, { through: 'User_Chat' })
User.belongsToMany(Chat, { through: 'User_Chat' })

module.exports = {
  User,
  Matcher,
  Party,
  Message,
  Chat
}
