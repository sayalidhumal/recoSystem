/**
 * Created by sayalidhumal on 7/23/17.
 */
(function(){
    angular.module('Studenthome').controller('UserCoursesController',UserCoursesController);

    UserCoursesController.$inject=["UserService","$stateParams"];

    function UserCoursesController(UserService,$stateParams){
        var vm = this;
        vm.userID = $stateParams.userID;

        //Markup data

        vm.coursesEnrolled = [
            {
                courseID:610,
                courseName:"Computer Architecture",
                totalUnits: 4
            },
            {
                courseID:660,
                courseName:"Operating Systems",
                totalUnits: 4
            },
            {
                courseID:630,
                courseName:"Theory of Algorithms",
                totalUnits: 4
            }

        ]
        vm.coursesTaken = [
            {
                courseID:602,
                courseName:"Automata theory",
                totalUnits: 4,
                gradePointsObtained:13.2,
                gradeObtained:"B+",
                QuarterTaken: "fall",
                QuarterYear:2016
            },
            {
                courseID:655,
                courseName:"Software Engineering",
                totalUnits: 4,
                gradePointsObtained:16,
                gradeObtained:"A",
                QuarterTaken: "fall",
                QuarterYear:2016
            }

        ]





        //till here


        /*vm.userCourseDetails =[];

        UserService.getEnrolledCourses(vm.userID).then(function success(response) {
            vm.userCourseDetails = response.data;
            vm.userCourseDetails.details = vm.userCourseDetails.details[0];
    console.log(vm.userCourseDetails)
},
    function error(reason) {

    })*/

}

})();
