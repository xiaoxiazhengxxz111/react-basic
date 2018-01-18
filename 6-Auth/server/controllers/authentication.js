const User = require('../models/user')
const jwt = require('jwt-simple')
const config = require('../config')

// generate token with a user
function tokenForUser(user) {
  const timeStamp = new Date().getTime()
  return jwt.encode({sub: user.id, iat: timeStamp}, config.secret)
}

exports.signup = function(req, res, next) {
  // how to get the user data? --> from request object
  // pull out data request object: req.body - anything contain inside the request
  const email = req.body.email
  const password = req.body.password

  if (!email || ! password) {
    return res.status(422).send({error: 'You must provide email and password!'})
  }
  // check User collection in DB to see if user with the given email exist
  User.findOne({email: email}, (err, existingUser) => {
      if (err) { return next(err)} // connect error

      // if user existed, return an error with response
      if (existingUser) {
        return res.status(422).send({error: 'Email is already used!'})
      }

      // else, create a user and save user to db
      const user = new User({email, password})

      user.save((err) => {
        if (err) { return next(err)}

        // respond the request indicating the user was created with a token for future authtentication
        res.json({token: tokenForUser(user)})
      })
  })
}

exports.signin = function(req, res, next) {
  // user has already had their email and pwd auth'd
  // we just need to send user back a token: passport localStrategy(LocalLogin) return a user
  res.send({token: tokenForUser(req.user)})
}