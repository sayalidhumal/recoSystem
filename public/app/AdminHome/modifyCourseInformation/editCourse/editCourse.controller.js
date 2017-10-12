

(function () {
    angular.module('AdminHome').controller('EditCourseController',EditCourseController);

    EditCourseController.$inject = ['CourseService','$stateParams','appconfig','$state'];

    function EditCourseController(CourseService,$stateParams,appconfig,$state) {
        var vm =this;
        vm.schedule = $stateParams.schedule;
        vm.submit = submit;
        vm.cancel = cancel;
        vm.start = new Date();
        if(vm.schedule.course_start_time){
            vm.time = vm.schedule.course_start_time.split(":")
            vm.schedule.course_start_time = new Date(null, null, null,vm.time[0],vm.time[1])
            vm.time = vm.schedule.course_end_time.split(":")
            vm.schedule.course_end_time = new Date(null, null, null,vm.time[0],vm.time[1])
        }

        if(vm.schedule.lab_start_time){
            vm.time = vm.schedule.lab_start_time.split(":")
            vm.schedule.lab_start_time = new Date(null, null, null,vm.time[0],vm.time[1])
            vm.time = vm.schedule.lab_end_time.split(":")
            vm.schedule.lab_end_time = new Date(null, null, null,vm.time[0],vm.time[1])
        }


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
            schedule = angular.copy(vm.schedule);
            schedule.course_id = parseInt(schedule.course_id);
            schedule.year = parseInt(schedule.year);
            console.log(new Date(vm.schedule.course_start_time).getMinutes())
            if(schedule.course_start_time){
                schedule.course_start_time = new Date(schedule.course_start_time).getHours()+":"+new Date(schedule.course_start_time).getMinutes();
                schedule.course_end_time = new Date(schedule.course_end_time).getHours()+":"+new Date(schedule.course_end_time).getMinutes();
            }

            if(schedule.lab_start_time){
               schedule.lab_start_time = new Date(schedule.lab_start_time).getHours()+":"+new Date(schedule.lab_start_time).getMinutes();
               schedule.lab_end_time = new Date(schedule.lab_end_time).getHours()+":"+new Date(schedule.lab_end_time).getMinutes();
            }
            console.log(schedule)

            CourseService.updateCourse(schedule).then(function success(response) {
                    console.log(response,"Successful operation")
                    $state.go('root.admin.courseDetails.viewCourseDetails',{courseID: schedule.course_id});
                },
                function error() {

            })
        }

        function cancel() {
            $state.go('root.admin.courseDetails.viewCourseDetails',{courseID: parseInt(vm.schedule.course_id)});
        }
    }
})();