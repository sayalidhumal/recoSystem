/**
 * Created by Sanjay Karrolla on 9/28/2017.
 */
(function(){
    angular.module('services').factory('PrerequisiteService',
        function($http){
            return{

                postprerequisite: function(data){

                    return $http({
                        method: 'POST',
                        url: '/addPrerequisite',
                        data:{data:data}
                    })
                },

                viewPrerequisite: function (coyote_id) {

                    return $http({
                        method: 'GET',
                        url: '/viewPrerequisite',
                        params:{coyote_id:coyote_id}
                    })

                },

                getPrerequisite:function () {

                    return $http({
                        method: 'GET',
                        url: '/getPrerequisite'
                    })

                },

                deletePrerequisite:function (coyote_id,course_id) {
                    return $http({
                        method: 'DELETE',
                        url: '/deletePrerequisite',
                        params: {coyote_id:coyote_id,course_id:course_id}
                    })
                }

            }//end of outer return
        })
})();
