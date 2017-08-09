/**
 * Created by sayalidhumal on 7/23/17.
 */
(function(){
    angular.module('Studenthome').controller('UserCoursesController',UserCoursesController);

    UserCoursesController.$inject=["UserService","$stateParams"];

    function UserCoursesController(UserService,$stateParams){
        var vm = this;
        vm.userID = $stateParams.userID;
        vm.userCourseDetails =[];

        UserService.getEnrolledCourses(vm.userID).then(function success(response) {
            vm.userCourseDetails = response.data;
            vm.userCourseDetails.details = vm.userCourseDetails.details[0];
            console.log(vm.userCourseDetails)
        },
        function error(reason) {

        })

    }
})();
