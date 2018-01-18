const passport = require('passport')
const User = require('../models/user')
const config = require('../config')
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStategy = require('passport-local')

// setup options for JWT Strategy
// after signup/signin will return a token, JWT Strategy tells JWT where to find the key from token
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

// create JWT strategy : payload is token object
const jwtLogin = new JWTStrategy(jwtOptions, function (payload, done) {
  // see if the user ID in the payload exists in our DB
  // if yes, call done with a user object
  // otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false)} // err and non user
    if (user) { 
       done(null, user) // no err and find user
    } else {
      done( null, false) // no err and no user
    }
  })
})

// create local strategy
// signup/signin need to verify the email/ email & pwd will return a token
const localOptions = {usernameField: 'email'}
const localLogin = new LocalStategy(localOptions, function(email, password, done) {
  // verify the email and pwd, call done with the user
  // if it is the correct email and pwd
  // else, call done with false
  User.findOne({email}, function(err, user) {
    if (err) { return done(err)}
    if (!user) { return done(null, false)}

    // compare pwd: is password === user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err)}
      if (!isMatch) { return done(null, false)}

      return done(null, user)
    })
  })
})

// tell passport to use this strategy
passport.use(jwtLogin)
passport.use(localLogin)
