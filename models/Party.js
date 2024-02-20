const {db, DataTypes} = require('../db/connection')

const Party = db.define(
    "Party",
    {
        gameName: DataTypes.STRING,
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = {
    Party
}