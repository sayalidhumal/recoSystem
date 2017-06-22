(function(){
  angular.module('services').factory('AuthService',
  function($http,$q,$state,UserService){
    var dfd = $q.defer();
    return{

      authenticate: function(userID) {
          return $http({
              method: 'GET',
              url: '/login',
              params:{userID: userID}
          })
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
