const {db, DataTypes} = require('../db/connection')

const Party = db.define(
    "Party",
    {
        gameName: {
           type: DataTypes.STRING,
           defaultValue: "test"
        }
    },
    {
        timestamps: true
    }
)

module.exports = {
    Party
}