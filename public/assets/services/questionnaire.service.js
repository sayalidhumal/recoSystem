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
                },

                getPreference: function (coyote_id) {

                    return $http({
                        method: 'GET',
                        url: '/getPreference',
                        params:{coyote_id:coyote_id}
                    })

                },

                updatePreference:function (preference) {
                    return $http({
                        method: 'PUT',
                        url: '/updatePreference',
                        data:{preferences:preference}
                    })
                }

            }//end of outer return
        })
})();
