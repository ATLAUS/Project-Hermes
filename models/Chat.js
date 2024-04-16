const { db, DataTypes } = require('../db/connection')

const Chat = db.define(
  'Chat',
  {
    gameName: DataTypes.STRING
  },
  {
    timestamps: true
  }
)

module.exports = {
  Chat
}
