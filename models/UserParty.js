const { db, DataTypes } = require('../db/connection')
const { User, Party } = require('./index')

const UserParty = db.define('UserParty', {
    UserId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    PartyId: {
        type: DataTypes.INTEGER,
        references: {
            model: Party,
            key: 'id'
        }
    }
});

module.exports = {
    UserParty
}