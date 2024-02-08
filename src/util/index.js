const { User, Matcher, Party } = require('../../models')
const { Op } = require('@sequelize/core')
// TODO add function to find matches upon matcher creation
const matchFinder = async(matcher, creator) => {

const match = await Matcher.findOne({
    where: {
        userId: { [Op.ne]: matcher.User.id},
        platform: matcher.platform,
        gameName: matcher.gameName
    },
    include: {
        model: User
    }
})
if(!match){
    return match
}

const matchedUser = await User.findByPk(match.User.id)

const newParty = await Party.create({
    gameName: matcher.gameName
})

await newParty.addUsers([creator, matchedUser])

const partyWithUsers = await Party.findByPk(
    newParty.id,
    {
        include: {
            model: User
        }
    }
)
return partyWithUsers
}


module.exports = {
    matchFinder
}