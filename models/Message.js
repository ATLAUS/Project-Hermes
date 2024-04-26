const { db, DataTypes } = require('../db/connection')

const Message = db.define(
  'Message',
  {
    message: DataTypes.STRING
  },
  {
    timestamps: true
  }
)

module.exports = {
  Message
}
