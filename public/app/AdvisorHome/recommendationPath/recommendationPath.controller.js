
(function () {
    angular.module('AdvisorHome').controller('recommendationPathController',recommendationPathController);

    recommendationPathController.$inject = ['UserService','$stateParams','$state'];

    function recommendationPathController(UserService,$stateParams,$state) {
        var vm=this;
        vm.coyote_id = $stateParams.coyote_id;
        vm.userDetails ={};
        vm.recommendationPath= {};
        vm.view = view;

        UserService.getRecommendationDetails(vm.coyote_id).then(
            function success(response) {
                console.log("",response.data);
                vm.userDetails = response.data;
                vm.recommendationPath =vm.userDetails.path
            },
            function error(response) {

            });

        function view(quarter,year) {
            quarter.year = year;
            $state.go('root.advisor.advisorhome.recommendationpath.detailView',{quarter: quarter});
        }


    }
})();