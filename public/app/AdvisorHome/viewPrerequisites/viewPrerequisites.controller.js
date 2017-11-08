(function () {
    angular.module('AdvisorHome').controller('viewPrerequisitesController',viewPrerequisitesController);

    viewPrerequisitesController.$inject = ['CourseService','$state','PrerequisiteService','$stateParams'];

    function viewPrerequisitesController(CourseService,$state,PrerequisiteService,$stateParams) {
        var vm =this;
        vm.form = {};
        vm.data = [];
        vm.prerequisite = [];
        vm.coyote_id = $stateParams.coyote_id;
            PrerequisiteService.viewPrerequisite(vm.coyote_id).then(
                function success(response) {
                    vm.prerequisite= response.data;
                    console.log("Prerequisite",vm.prerequisite);
                },function error(response) {
                    console.log(response);
                });
    }
})();
