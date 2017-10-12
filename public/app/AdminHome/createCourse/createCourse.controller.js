/**
 * Created by sayalidhumal on 8/13/17.
 */

(function () {
    angular.module('AdminHome').controller('createCourseController',createCourseController);

    createCourseController.$inject = ['CourseService','$state'];

    function createCourseController(CourseService,$state) {
        var vm =this;
        vm.cancel = cancel;
        vm.create = create;
        vm.form = {};
        vm.course = {
            "course_id": null,
            "has_lab": '',
            "course_level": null,
            "units": null,
            "name": null,
            "course_dept": null,
            'quarter':null,
            'year':null,
            'instructor':null,
            'course_day':null,
            'course_start_time':new Date(null, null, null,08,00),
            'course_end_time':new Date(null, null, null,08,00),
            'lab_day':null,
            'lab_start_time':new Date(null, null, null,08,00),
            'lab_end_time':new Date(null, null, null,08,00)
        }

        function create() {
            schedule = angular.copy(vm.course);
            schedule.course_id = parseInt(schedule.course_id);
            schedule.year = parseInt(schedule.year);
            if(schedule.course_start_time){
                schedule.course_start_time = new Date(schedule.course_start_time).getHours()+":"+new Date(schedule.course_start_time).getMinutes();
                schedule.course_end_time = new Date(schedule.course_end_time).getHours()+":"+new Date(schedule.course_end_time).getMinutes();
            }

            if(schedule.lab_start_time){
                schedule.lab_start_time = new Date(schedule.lab_start_time).getHours()+":"+new Date(schedule.lab_start_time).getMinutes();
                schedule.lab_end_time = new Date(schedule.lab_end_time).getHours()+":"+new Date(schedule.lab_end_time).getMinutes();
            }
            console.log(schedule)
            CourseService.createCourse(schedule).then(function(response) {
                    console.log("Course Creation Succsessful");
                    $state.go('root.admin.courseDetails.viewCourseDetails',{courseID: schedule.course_id});
                },
                function error(reason) {
                    console.log(reason);
                })
        }

        function cancel() {
            $state.go('root.admin.createCourse');
        }
    }
})();