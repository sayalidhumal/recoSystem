
(function () {
    angular.module('AdvisorHome').controller('recommendationPathController',recommendationPathController);

    recommendationPathController.$inject = ['UserService','$stateParams','$state'];

    function recommendationPathController(UserService,$stateParams,$state) {
        var vm=this;
        vm.coyote_id = $stateParams.coyote_id;
        vm.userDetails ={};
        vm.recommendationPath= {};
        vm.view = view;
        vm.edit = edit;

        UserService.getRecommendationDetails(vm.coyote_id).then(
            function success(response) {
                console.log("",response.data);
                vm.userDetails = response.data;
                vm.recommendationPath =vm.userDetails.path[0].path;
                vm.optionalSubjects = vm.userDetails.path[0].optionalElective
            },
            function error(response) {

            });

        function edit() {
            $state.go('root.advisor.advisorhome.recommendationpath.editPath',{path:vm.userDetails.path})
        }
        function view(quarter,year) {
            quarter.year = year;
            $state.go('root.advisor.advisorhome.recommendationpath.detailView',{quarter: quarter});
        }


    }
})();