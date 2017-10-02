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
            'course_start_time':null,
            'course_end_time':null,
            'lab_day':null,
            'lab_start_time':null,
            'lab_end_time':null
        }

        function create() {
            CourseService.createCourse(vm.course).then(function(response) {
                    console.log("Course Creation Succsessful");
                    $state.go('root.admin.createCourse');
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