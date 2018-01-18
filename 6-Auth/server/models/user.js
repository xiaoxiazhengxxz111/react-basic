const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

// defin our model
const userSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String
})

// on save hook, encrypt password --------can't use arrow function because of "this"
// before save the user obj to DB, run this function
userSchema.pre('save', function(next) {
  // get access to the user model
  const user = this;

  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err)}

    // hash(encrypt password)with salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err)}
      
      // overwrite the plain text password with encrypt password
      user.password = hash;
      next(); // go ahead you can save the user model to DB
    })    
  })
})

// any userSchema instance can access to methods obj's comparePassword function
// callback is "done" in passort, need callback because this is async
userSchema.methods.comparePassword = function(candidatePwd, callback) {
  bcrypt.compare(candidatePwd, this.password, function(err, isMatch){
    if (err) { return callback(err)}
    callback(null, isMatch)
  })
}

// create the model class: use schema to create a model
const ModelClass = mongoose.model('user', userSchema)

// export the model
module.exports = ModelClass
