

(function () {
    angular.module('AdminHome').controller('EditCourseController',EditCourseController);

    EditCourseController.$inject = ['CourseService','$stateParams','appconfig','$state'];

    function EditCourseController(CourseService,$stateParams,appconfig,$state) {
        var vm =this;
        vm.schedule = $stateParams.schedule;
        console.log(vm.schedule);
        vm.submit = submit;
        vm.cancel = cancel;

        // CourseService.getCourseDetailsForYear(vm.courseID,vm.currentYear,vm.nextYear).then(
        //     function success(response) {
        //
        //         vm.course = response.data;
        //         vm.course.details = vm.course.details[0];
        //         console.log(vm.course.details,"course_details")
        //         vm.course.prerequisite = vm.course.prerequisite[0]
        //         console.log(vm.course.prerequisite,"course+prereq")
        //
        //         CourseService.getCourseType(vm.courseID).then(
        //             function success(response) {
        //
        //                 vm.courseType = response.data[0];
        //                 console.log(vm.courseType,"coursetype")
        //             },
        //             function error(response){
        //             })
        //     },
        //     function error() {
        //
        //     })


        function submit() {
            vm.schedule.course_id = parseInt(vm.schedule.course_id);
            vm.schedule.course_start_time = parseInt(vm.schedule.course_start_time);
            CourseService.updateCourse(vm.schedule).then(
                function success(response) {
                    console.log("Successful operation")
                },
                function error() {

                })
        }

        function cancel() {
            $state.go('root.admin.courseDetails');
        }
    }
})();