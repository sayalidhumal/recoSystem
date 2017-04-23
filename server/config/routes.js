var auth =require('./auth')
module.exports = function(app){

  app.post('/login', auth.authenticate)

  app.get('*',function(req,res){
    res.render('index.html');
  })
};
