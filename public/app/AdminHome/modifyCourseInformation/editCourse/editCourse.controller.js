

(function () {
    angular.module('AdminHome').controller('EditCourseController',EditCourseController);

    EditCourseController.$inject = ['CourseService','$stateParams','appconfig','$state'];

    function EditCourseController(CourseService,$stateParams,appconfig,$state) {
        var vm =this;
        vm.schedule = $stateParams.schedule;
        console.log(vm.schedule);
        //vm.submit = submit;
        vm.cancel = cancel;

        // CourseService.getCourseDetailsForYear(vm.courseID,vm.currentYear,vm.nextYear).then(
        //     function success(response) {
        //
        //         vm.course = response.data;
        //         vm.course.details = vm.course.details[0];
        //         vm.course.prerequisite = vm.course.prerequisite[0]
        //
        //         CourseService.getCourseType(vm.courseID).then(
        //             function success(response) {
        //
        //                 vm.courseType = response.data[0];
        //             },
        //             function error(response){
        //             })
        //     },
        //     function error() {
        //
        //     })
        //
        //
        // /*function submit() {
        //     CourseService.updateCourse(vm.coyote_id,null).then(
        //         function success(response) {
        //
        //             vm.user = response.data[0];
        //             console.log(vm.user)
        //             console.log("role",vm.role)
        //         },
        //         function error() {
        //
        //         })
        // }*/

        function cancel() {
            $state.go('root.admin.courseDetails');
        }
    }
})();