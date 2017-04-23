var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');
module.exports = {
  development:{
    db: 'mongodb://localhost/training',
    rootPath:rootPath,
    port: process.env.PORT || 3030
  },
  production:{
    db:'mongodb://sayali:sayali@ds157740.mlab.com:57740/training',
    rootPath: rootPath,
    port: process.env.PORT || 80
  }
};
