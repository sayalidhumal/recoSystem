/**
 * Created by sayalidhumal on 7/23/17.
 */
(function(){
    angular.module('Studenthome').controller('UserCoursesController',UserCoursesController);

    UserCoursesController.$inject=["UserService","$stateParams"];

    function UserCoursesController(UserService,$stateParams){
        var vm = this;
        vm.coyote_id = $stateParams.userID;
        console.log(vm.coyote_id,"ID");
        vm.gradePointAverage = 0;

        vm.userCourseDetails =[];
        //vm.gradePointAverageCalculate=gradePointAverageCalculate;

        UserService.getCoursesTaken(vm.coyote_id).then(function success(response) {
                vm.userCourseDetails = response.data;
                console.log(vm.userCourseDetails)
                vm.gradePointAverage = gradePointAverageCalculate(vm.userCourseDetails);
                console.log(vm.gradePointAverage,"gradePointAverage")
            },
            function error(reason) {}
        )
        function gradePointAverageCalculate(userCourseDetails) {
            var gradeopts = {
                "A": 4,
                "A-": 3.7 ,
                "B+": 3.3,
                "B": 3,
                "B-": 2.7,
                "C+": 2.3,
                "C": 2,
                "C-": 1.7,
                "D+": 1.3,
                "D": 1,
                "D-": 0.7,
                "F": 0
            }
            var gradepoints = 0;
            var totalUnitstaken = 0;
            var gradePointAverage =0;
            for(var i=0;i<userCourseDetails.length;i++){
                if(userCourseDetails[i].grade){
                    gradepoints = gradepoints + (userCourseDetails[i].units*gradeopts[userCourseDetails[i].grade]);
                    totalUnitstaken = totalUnitstaken + userCourseDetails[i].units;
                }
            }
            if(gradepoints){
                gradePointAverage = gradepoints / totalUnitstaken;
            }

            return gradePointAverage;

            // angular.forEach(vm.userCourseDetails,function (course) {
            //     if(course.grade=== gradeopts.grade){
            //         gradepoints= course.units*gradeopts.weight;
            //         gradePointAverage= gradePoints/course.length();
            //         console.logs(gradePointAverage,"GPA");
            //     }
            // })
        }
    }


})();


// vm.gradeopts = [
//     {grade: 'A', weight: 4},
//     {grade: 'A-', weight: 3.7},
//     {grade: 'B+', weight: 3.3},
//     {grade: 'B', weight: 3},
//     {grade: 'B-', weight: 2.7},
//     {grade: 'C+', weight: 2.3},
//     {grade: 'C', weight: 2},
//     {grade: 'C-', weight: 1.7},
//     {grade: 'D+', weight: 1.3},
//     {grade: 'D', weight: 1},
//     {grade: 'D-', weight: 0.7},
//     {grade: 'F', weight: 0}
// ];//
// vm.gpaCalculate = function() {
//     // Recalculate GPA on every dropdown change.
//     var total_units = 0;
//     var total_score = 0;
//
//     vm.forEach(vm.userCourseDetails, function(course) {
//         // Don't calculate for pass/no-pass courses!
//         if (course.grade === '') {
//             total_units += parseFloat(course.units, 10);
//             total_score += course.score;
//         }
//     });
//
//     // The standard GPA calculation formula
//     vm.estimated_gpa = total_score / total_units;
// };
//
// vm.gpaInit = function() {
//     // On init, be generous... start everyone off with a 4.0
//     angular.forEach($scope.schedule, function(course) {
//         course.estimated_grade = 4;
//     });
//     $scope.gpaCalculate();
// }();



// //Markup data
// vm.coursesEnrolled = [
//     {
//         courseID:610,
//         courseName:"Computer Architecture",
//         totalUnits: 4
//     },
//     {
//         courseID:660,
//         courseName:"Operating Systems",
//         totalUnits: 4
//     },
//     {
//         courseID:630,
//         courseName:"Theory of Algorithms",
//         totalUnits: 4
//     }
//
// ]
//
//
// vm.lettergrade= [
//     {"A": 4},
//     {"A-": 3.7 },
//     {"B+": 3.3},
//     {"B": 3},
//     {"B-": 2.7},
//     {"C+": 2.3},
//     {"C": 2},
//     {"C-": 1.7},
//     {"D+": 1.3},
//     {"D": 1},
//     {"D-": 0.7},
//     {"F": 0}
// ]

