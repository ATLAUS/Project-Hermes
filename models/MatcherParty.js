const { db, DataTypes } = require('../db/connection')
const { Matcher, Party } = require('../models/index')

const MatcherParty = db.define('MatcherParty', {
    MatcherId: {
        type: DataTypes.INTEGER,
        references: {
            model: Matcher,
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
    MatcherParty
}