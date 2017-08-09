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

                /*addPreference: function(preferences){

                    return $http({
                        method: 'POST',
                        url: '/addPreference',
                        data:{preferences:preferences}
                    })
                }*/

            }//end of outer return
        })
})();
