(function(){
  angular.module('services').factory('AuthService',
  function($http){
    return{

      authenticate: function(userID) {
          return $http({
              method: 'GET',
              url: '/login',
              params:{userID: userID}
          })
      },

      /*logoutUser: function() {
        var dfd = $q.defer();
        $http.post('/logout',{logout:true}).then(function(){
          dfd.resolve();
        })
        return dfd.promise;
      },*/

      createUser: function(User){
        console.log("inside service", User)
        return $http({
            method: 'POST',
            url: '/createUser',
            data:{user:User}
        })
      }

    }//end of outer return
  })
})();
