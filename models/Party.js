const {db, DataTypes} = require('../db/connection')

const Party = db.define(
    "Party",
    {
        gameName: {
           type: DataTypes.STRING,
           defaultValue: "test"
        },
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