const { User } = require('../../models')

const userAuth = async (req, res, next) => {
  // Get the user details from the headers
  const userInfo = JSON.parse(req.headers['x-user-info'])
  const userId = userInfo.sub.split('|')[1]

  try {
    // Check and see if the user already exists in the db.
    let userCheck = await User.findOne({
      where: {
        userId: userId
      }
    })

    // If a userCheck comes back null because a user does not exist in the db
    // A new one is created. ELSE the user does exist in the db and we dont create a new one.
    if (!userCheck) {
      let newUser = await User.create({
        userId: userId,
        userName: userInfo.nickname,
        email: userInfo.email
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
  // next()
}

module.exports = {
  userAuth
}
