var express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

var config = require('./server/config/config')[env];

require('./server/config/express')(app,config);

require('./server/config/mongoose')(config);


var User = mongoose.model('User');
console.log("calling LocalStrategy",User)
passport.use(new LocalStrategy({
    usernameField:'username',
    passwordField:'password'
  },
  function(username,password,done){
    User.findOne({username:username}).exec(function(err,user){
      console.log("error",err,user);
      if(user && user.authenticate(password)){
        return done(null,user);
      }
      else {
        console.log("User Not Found")
        return done(null,false);
      }
    })
  }
))

passport.serializeUser(function(user,done){

  if(user){
    console.log("inside serializeUser",user)
    done(null,user._id);
  }
});

passport.deserializeUser(function(id,done){
  User.findOne({_id:id}).exec(function(err,user){
    if(user){
      return done(null,user);
    }
    else {
      return done(null,false);
    }
  })
});

require('./server/config/routes')(app);

app.listen(config.port);
console.log('listening on port '+config.port+'...');
