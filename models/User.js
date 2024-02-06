const { db, DataTypes } = require('../db/connection')

const User = db.define('User',
{
    userId: DataTypes.STRING,
    userName: DataTypes.STRING,
    activeMatcher: DataTypes.BOOLEAN,
},{
    timestamps: true
})

module.exports = {
    User
}