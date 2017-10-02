/**
 * Created by Sanjay Karrolla on 9/24/2017.
 */
/**
 * Created by sayalidhumal on 8/13/17.
 */

(function () {
    angular.module('AdvisorHome').controller('addPrerequisitesController',addPrerequisitesController);

    addPrerequisitesController.$inject = ['CourseService','$state','AddPrerequisiteService','$stateParams'];

    function addPrerequisitesController(CourseService,$state,AddPrerequisiteService,$stateParams) {
        var vm =this;
        vm.form = {};
        vm.searchName = '';
        vm.searchID = '';
        vm.search = search;
        vm.data = [];
        vm.add =add;
        vm.prerequisite = {
            "coyote_id":"$stateParams.coyote_id",
            "course_id":"null"
        }
        function add(course) {
            vm.prerequisite.course_id = course.course_id;
            vm.prerequisite.coyote_id = $stateParams.coyote_id;
            vm.data.push(vm.prerequisite);
            console.log(vm.data);
            AddPrerequisiteService.postprerequisite(vm.data[0]).then(
                function success(response) {
                    console.log("Prerequisite posted");
                },function error(response) {
                    console.log(response);
                });
        }

        function search(searchName,searchID) {
            CourseService.getCourse(searchID,searchName).then(
            function success(response) {
                vm.course = response.data[0];

            },function error(response) {
                console.log(response);
            });
    }
    }
})();