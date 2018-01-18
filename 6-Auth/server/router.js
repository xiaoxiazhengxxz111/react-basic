const Authentication = require('./controllers/authentication')
const passportService = require('./services/passport')
const passport = require('passport')

// helpers
// tell passport use 'jwt' strategy and dont create session
const requireAuth = passport.authenticate('jwt', {session: false})
const requireSignin = passport.authenticate('local', {session: false})

module.exports = function(app) {
  // any incoming request needs to pass requireAuth, then reach to router handler
  app.get('/', requireAuth, (req, res ,next)=>{
    res.send({message: 'secrect 123abc'})
  })

  app.post('/signin', requireSignin, Authentication.signin)
  app.post('/signup', Authentication.signup)
}

