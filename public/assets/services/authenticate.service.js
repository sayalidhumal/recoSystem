(function(){
  angular.module('services').factory('AuthService',
  function($http){
    return{

      authenticate: function(coyote_id) {
          return $http({
              method: 'GET',
              url: '/login',
              params:{coyote_id: coyote_id}
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
      }, 
        
      resetPassword: function (email,code) {
          return $http({
              method: 'POST',
              url: '/resetPassword',
              data:{email: email,code:code}
          })
      },
      changePassword: function (password,coyoteID) {
          return $http({
              method: 'PUT',
              url: '/changePassword',
              data:{password:password,coyote_id:coyoteID}
          })
      }

    }//end of outer return
  })
})();
