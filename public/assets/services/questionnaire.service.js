(function(){
    angular.module('services').factory('QuestionnaireService',
        function($http){
            return{

                /*authenticate: function(userID) {
                    return $http({
                        method: 'GET',
                        url: '/login',
                        params:{userID: userID}
                    })
                },*/

                addPreference: function(preferences){

                    return $http({
                        method: 'POST',
                        url: '/addPreference',
                        data:{preferences:preferences}
                    })
                }

            }//end of outer return
        })
})();
