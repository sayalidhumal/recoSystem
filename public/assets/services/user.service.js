(function(){
    angular.module('services').factory('UserService',
        function($http){
            return{

                getEnrolledCourses: function(userID) {
                    return $http({
                        method: 'GET',
                        url: '/getEnrolledCourses',
                        params:{userID: userID}
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

                postUser: function (coyote_id, name) {
                    return $http({
                        method:'PUT',
                        url:'/postUser',
                        params:{coyote_id: coyote_id , name: name }
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

            }//end of outer return
        })
})();
