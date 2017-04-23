var passport = require('passport');
exports.authenticate = function(req,res,next){
  var auth = passport.authenticate('local', function(err,user){

    if(err)
      return next(err);
    if(!user){
      console.log("!us",user)
      res.send({success:false});
    }
    req.logIn(user,function(user){
      if(err)
        return next(err);
      res.send({success:true, user:user});
    })
  })
  auth(req,res,next);
}
