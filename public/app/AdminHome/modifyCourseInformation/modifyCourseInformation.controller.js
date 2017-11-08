/**
 * Created by sayalidhumal on 8/13/17.
 */

(function () {
    angular.module('AdminHome').controller('modifyCourseInformationController',modifyCourseInformationController);

    modifyCourseInformationController.$inject = ['CourseService','$state'];

    function modifyCourseInformationController(CourseService,$state) {
        var vm =this;
        vm.form = {};
        vm.searchName = '';
        vm.searchID = '';
        vm.search = search;
        vm.course = [];
        vm.error = false;
        vm.view =view;

        function view(course) {
            console.log(course)
            $state.go('root.admin.courseDetails.viewCourseDetails',{courseID: course.course_id});
        }

        function search(searchName,searchID) {
            vm.error = false;
            CourseService.getCourse(searchID,searchName).then(
                function success(response) {
                    if(response.data.length !=0){
                        vm.course = response.data;
                    }else {
                        vm.error = true;
                    }

                },function error(response) {
                    console.log(response);
                });
        }
    }
})();