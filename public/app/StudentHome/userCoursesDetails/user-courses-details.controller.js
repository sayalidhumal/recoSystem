/**
 * Created by sayalidhumal on 7/23/17.
 */
(function(){
    angular.module('Studenthome').controller('UserCoursesController',UserCoursesController);

    UserCoursesController.$inject=["UserService","$stateParams","appconfig","$filter"];

    function UserCoursesController(UserService,$stateParams,appconfig,$filter){
        var vm = this;
        vm.coyote_id = $stateParams.userID;
        console.log(vm.coyote_id,"ID");
        vm.gradePointAverage = 0;
        vm.currentYear = appconfig.CurrentYear;
        vm.currentMonth = $filter('date')(new Date(), 'MMMM');
        vm.currentQuarter = appconfig.QUARTERS[vm.currentMonth];
        vm.userCourseDetails =[];
        vm.quarterOrder = appconfig.QuarterOrder;
        //vm.gradePointAverageCalculate=gradePointAverageCalculate;

        UserService.getEnrolledCourses(vm.coyote_id).then(function success(response) {
                vm.userCourseDetails = response.data;
                console.log("userDetails",vm.userCourseDetails);
                vm.coursesTaken=[];
                vm.coursesEnrolled=[];
                for(var i=0;i<vm.userCourseDetails.length;i++){
                    if(vm.userCourseDetails[i].grade!=null){
                        vm.coursesTaken.push(vm.userCourseDetails[i]);
                    }else {
                        vm.coursesEnrolled.push(vm.userCourseDetails[i]);
                    }
                }
                console.log("courseTaken",vm.coursesTaken,vm.coursesEnrolled);
                vm.gradePointAverage = gradePointAverageCalculate(vm.coursesTaken);
                vm.coursesTaken = displayFormat(vm.coursesTaken);
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
        }

        function displayFormat(courses) {
            var display = [];
            var quar = vm.quarterOrder;
            for(var i=0;i<courses.length;i++){
                courses[i].quarter = courses[i].quarter_year.quarter;
                courses[i].year = courses[i].quarter_year.year
            }
            courses = _.groupBy(courses,'year');
            angular.forEach(courses,function (data,year) {
                var yearobj = {
                    year : year,
                    quarters: []
                };
                data = _.groupBy(data,'quarter');
                for(i=0;i<quar.length;i++){
                    if(data[quar[i]]){
                        var quarterObj = {
                            quarter: quar[i],
                            schedule: data[quar[i]]
                        };
                        yearobj.quarters.push(quarterObj);
                    }
                }
                display.push(yearobj);
            })
            console.log(display)
            return display

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

