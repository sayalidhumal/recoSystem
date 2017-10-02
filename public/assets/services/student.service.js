/**
 * Created by Sanjay Karrolla on 9/28/2017.
 */
(function(){
    angular.module('services').factory('AddPrerequisiteService',
        function($http){
            return{

                postprerequisite: function(data){

                    return $http({
                        method: 'POST',
                        url: '/addPrerequisite',
                        data:{data:data}
                    })
                }

            }//end of outer return
        })
})();
