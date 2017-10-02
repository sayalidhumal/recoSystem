/**
 * Created by sayalidhumal on 8/13/17.
 */

(function () {
    angular.module('AdminHome').controller('ViewCourseController',ViewCourseController);

    ViewCourseController.$inject = ['CourseService','$stateParams','appconfig','$state'];

    function ViewCourseController(CourseService,$stateParams,appconfig,$state) {
        var vm =this;
        vm.courseID = $stateParams.courseID;
        vm.courseType = '';
        vm.currentYear = appconfig.CurrentYear;
        vm.nextYear = appconfig.NextYear
        vm.course = {}
        vm.edit = edit;

        function edit(schedule) {
            $state.go('root.admin.courseDetails.viewCourseDetails.editCourseDetails',{schedule: schedule});
        }

        CourseService.getCourseDetailsForYear(vm.courseID,vm.currentYear,vm.nextYear).then(
            function success(response) {

                vm.course = response.data;
                vm.course.details = vm.course.details[0];
                vm.course.prerequisite = vm.course.prerequisite[0]

                CourseService.getCourseType(vm.courseID).then(
                    function success(response) {

                        vm.courseType = response.data[0];
                    },
                    function error(response){
                })
            },
            function error() {

        })

    }
})();