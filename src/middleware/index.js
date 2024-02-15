const { User } = require('../../models')

const userAuth = async (req, res, next) => {
  const { nickname, email, sub } = req.oidc.user
  const userId = sub.split('|')[1]

  try {
    // Check and see if the user already exists in the db
    // TODO See if findorcreate would make more sense
    let userCheck = await User.findOne({
      where: {
        userId: userId
      }
    })

    // If a userCheck comes back null because a user does not exist in the db
    // A new one is created. ELSE the user does exist in the db and we dont create a new one
    if (!userCheck) {
      let newUser = await User.create({
        userId: userId,
        userName: nickname,
        email: email
      })
      req.user = newUser
      next()
      return
    }
    req.user = userCheck
    next()
    return
  } catch (error) {
    next(error)
  }
}

module.exports = {
  userAuth
}
