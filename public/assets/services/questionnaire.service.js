(function(){
    angular.module('services').factory('QuestionnaireService',
        function($http){
            return{

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
