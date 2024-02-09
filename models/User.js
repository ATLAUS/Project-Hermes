const { db, DataTypes } = require('../db/connection')

const User = db.define(
  'User',
  {
    userId: DataTypes.STRING,
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    activeParty: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    timestamps: true
  }
)

module.exports = {
  User
}
