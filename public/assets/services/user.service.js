(function(){
    angular.module('services').factory('UserService',
        function($http){
            return{

                getEnrolledCourses: function(coyote_id) {
                    return $http({
                        method: 'GET',
                        url: '/getEnrolledCourses',
                        params:{coyote_id: coyote_id}
                    })
                },

                getUserRole: function(coyote_id) {
                    return $http({
                        method: 'GET',
                        url: '/getUserRole',
                        params:{coyote_id: coyote_id}
                    })
                },

                getUser: function (coyote_id, name) {
                  return $http({
                      method:'GET',
                      url:'/getUser',
                      params:{coyote_id: coyote_id , name: name }
                  })

                },

                addRecommendationPath: function (path,coyote_id) {
                    return $http({
                        method: 'PUT',
                        url: '/addRecommendationPath',
                        data:{path:path,coyote_id:coyote_id}
                    })
                },

                /*addPreference: function(preferences){

                    return $http({
                        method: 'POST',
                        url: '/addPreference',
                        data:{preferences:preferences}
                    })
                }*/

                getRecommendationDetails: function(coyote_id) {
                    return $http({
                        method: 'GET',
                        url: '/getRecommendationDetails',
                        params:{coyote_id: coyote_id}
                    })
                },
                updateUser: function(user) {
                    console.log("user in service",user)
                    return $http({
                        method: 'PUT',
                        url: '/updateUser',
                        data:{user: user}
                    })
                },

                deleteUser: function (coyote_id) {
                    return $http({
                        method: 'DELETE',
                        url: '/deleteUser',
                        params: {coyote_id: coyote_id}
                    })
                }

            }//end of outer return
        })
})();
