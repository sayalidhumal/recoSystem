(function(){
  angular.module('services').factory('AuthService',
  function($http,$q,$state,UserService){
    var dfd = $q.defer();
    return{

      authenticate: function(username,password) {
        var dfd = $q.defer();
        $http.post('/login',{username: username, password: password}).then(function(response) {
          console.log(response);
          if(response.data.success){
            var user = new UserService();
            angular.extend(user, response.data.user);
            dfd.resolve(true);
          }
          else
            dfd.resolve(false);
        });
        return dfd.promise;
      },

      logoutUser: function() {
        var dfd = $q.defer();
        $http.post('/logout',{logout:true}).then(function(){
          dfd.resolve();
        })
        return dfd.promise;
      },

      createUser: function(User){
        var newUser = new UserService(User);
        console.log("inside create user service",newUser)
        var dfd = $q.defer();
        newUser.$save().then(function(){
          console.log("saved data")
          dfd.resolve();
        },function(response){
          dfd.reject(response.data.reason);
        });
        return dfd.promise;
      }

    }//end of outer return
  })
})();
