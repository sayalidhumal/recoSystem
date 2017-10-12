
(function () {
    angular.module('AdvisorHome').controller('recommendationPathController',recommendationPathController);

    recommendationPathController.$inject = ['UserService','$stateParams','_','CourseService','$stateParams','$filter','appconfig'];

    function recommendationPathController(UserService,$stateParams,_,CourseService,$stateParams,$filter,appconfig) {
        var vm=this;
        vm.coyote_id = $stateParams.coyote_id;
        vm.userDetails ={};
        vm.recommendationPath= {};

        UserService.getRecommendationDetails(vm.coyote_id).then(
            function success(response) {
                console.log("",response.data);
                vm.userDetails = response.data;
                vm.recommendationPath =vm.userDetails.path
            },
            function error(response) {

            });


    }
})();