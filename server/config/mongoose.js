var mongoose = require('mongoose'),
    crypto = require('crypto');
module.exports = function(config){
  mongoose.connect(config.db);
  var db = mongoose.connection;
  db.on('error',console.error.bind(console,'connection error...'));
  db.once('open',function callback(){
    console.log('training db opened');
  });

  var userSchema = mongoose.Schema({
    firstname:String,
    lastname:String,
    username:String,
    salt: String,
    hash_pwd: String
  });
userSchema.methods = {
  authenticate: function(passwordtomatch){
    return hashPwd(this.salt,passwordtomatch) === this.hash_pwd;
  }
}
  var User = mongoose.model('User',userSchema);
  User.find({}).exec(function(err,collection){
    console.log("inside mongoose",collection);
    if(collection.length===0){
      console.log("creating...");
      var salt = createSalt();
      var hash = hashPwd(salt,'sayali');
      User.create({firstname:'sayali',lastname:'dhumal',username:'sayalidhumal',salt:salt,hash_pwd:hash})
    }
  });
}

function createSalt() {
  return crypto.randomBytes(128).toString('base64');
}

function hashPwd(salt,pwd){
  var hmac = crypto.createHmac('sha1',salt);
  return hmac.update(pwd).digest('hex');
}
