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
        vm.editschedule = editschedule;

        function editschedule(schedule,has_lab,course_id) {
            schedule.has_lab = has_lab;
            schedule.course_id = course_id;
            $state.go('root.admin.courseDetails.viewCourseDetails.editCourseDetails',{schedule: schedule});
        }

        CourseService.getCourseDetailsForYear(vm.courseID,vm.currentYear,vm.nextYear).then(
            function success(response) {

                vm.course = response.data;
                console.log(vm.course)
                vm.course.details = vm.course.details[0];
                vm.course.prerequisite = vm.course.prerequisite[0]
                for(var i=0;i<vm.course.schedule.length;i++){
                    if(vm.course.schedule[i].course_start_time){
                        vm.time = vm.course.schedule[i].course_start_time.split(":")
                        vm.course.schedule[i].course_start_time = new Date(null, null, null,vm.time[0],vm.time[1]).toLocaleTimeString();
                        vm.time = vm.course.schedule[i].course_end_time.split(":")
                        vm.course.schedule[i].course_end_time = new Date(null, null, null,vm.time[0],vm.time[1]).toLocaleTimeString();
                    }

                    if(vm.course.schedule[i].lab_start_time){
                        vm.time = vm.course.schedule[i].lab_start_time.split(":")
                        vm.course.schedule[i].lab_start_time = new Date(null, null, null,vm.time[0],vm.time[1]).toLocaleTimeString();
                        vm.time = vm.course.schedule[i].lab_end_time.split(":")
                        vm.course.schedule[i].lab_end_time = new Date(null, null, null,vm.time[0],vm.time[1]).toLocaleTimeString();
                    }
                }
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