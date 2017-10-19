

(function () {
    angular.module('AdminHome').controller('AddCourseController',AddCourseController);

    AddCourseController.$inject = ['CourseService','$stateParams','appconfig','$state'];

    function AddCourseController(CourseService,$stateParams,appconfig,$state) {
        var vm =this;
        vm.course = $stateParams.course;
        vm.schedule = {
            course_day:"",
            course_end_time: new Date(null, null, null,08,00),
            course_id: null,
            course_start_time: new Date(null, null, null,08,00),
            instructor: "",
            lab_day: "",
            lab_end_time: new Date(null, null, null,08,00),
            lab_start_time: new Date(null, null, null,08,00),
            quarter: '',
            year:null
        }
        vm.schedule.has_lab = vm.course.details.has_lab;
        vm.schedule.course_id = vm.course.details.course_id;
        vm.add = add;
        vm.cancel = cancel;
        vm.start = new Date();

        function add() {
            var schedule = angular.copy(vm.schedule);
            schedule.course_id = parseInt(schedule.course_id);
            schedule.year = parseInt(schedule.year);
            if(new Date(schedule.course_start_time).getHours()!==8){
                schedule.course_start_time = new Date(schedule.course_start_time).getHours()+":"+new Date(schedule.course_start_time).getMinutes();
                schedule.course_end_time = new Date(schedule.course_end_time).getHours()+":"+new Date(schedule.course_end_time).getMinutes();
            }else {
                schedule.course_start_time = null;
                schedule.course_end_time = null
            }
            if(new Date(schedule.lab_start_time).getHours()!==8){
                schedule.lab_start_time = new Date(schedule.lab_start_time).getHours()+":"+new Date(schedule.lab_start_time).getMinutes();
                schedule.lab_end_time = new Date(schedule.lab_end_time).getHours()+":"+new Date(schedule.lab_end_time).getMinutes();
            }else {
                schedule.lab_start_time = null;
                schedule.lab_end_time = null
            }

            CourseService.addSchedule(schedule).then(function success(response) {
                    $state.go('root.admin.courseDetails.viewCourseDetails',{courseID: schedule.course_id});
                },
                function error() {

            })
        }

        function cancel() {
            $state.go('root.admin.courseDetails.viewCourseDetails',{courseID: parseInt(vm.schedule.course_id)});
        }
    }
})();/**
 * Created by sayalidhumal on 10/15/17.
 */
