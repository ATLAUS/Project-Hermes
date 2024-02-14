const { db, DataTypes } = require('../db/connection')

const Matcher = db.define(
  'Matcher',
  {
    gameName: DataTypes.STRING,
    platform: DataTypes.STRING,
    objective: DataTypes.STRING,
    note: DataTypes.STRING,
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
  Matcher
}
