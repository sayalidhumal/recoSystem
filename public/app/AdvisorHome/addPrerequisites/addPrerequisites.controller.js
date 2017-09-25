/**
 * Created by Sanjay Karrolla on 9/24/2017.
 */
/**
 * Created by sayalidhumal on 8/13/17.
 */

(function () {
    angular.module('AdvisorHome').controller('addPrerequisitesController',addPrerequisitesController);

    addPrerequisitesController.$inject = ['CourseService','$state'];

    function addPrerequisitesController(CourseService,$state) {
        var vm =this;
        vm.form = {};
        vm.searchName = '';
        vm.searchID = '';
        vm.search = search;
        vm.course = [];
        vm.view =view;

        function view(course) {
            console.log(course)
            $state.go('root.admin.courseDetails.viewCourseDetails',{courseID: course.course_id});
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