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
        vm.totalUnitstaken = 0;

        UserService.getEnrolledCourses(vm.coyote_id).then(function success(response) {
                vm.userCourseDetails = response.data;
                vm.coursesTaken=[];
                vm.coursesEnrolled=[];
                for(var i=0;i<vm.userCourseDetails.length;i++){
                    if(vm.userCourseDetails[i].grade!=null){
                        vm.coursesTaken.push(vm.userCourseDetails[i]);
                    }else {
                        vm.coursesEnrolled.push(vm.userCourseDetails[i]);
                    }
                }

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
            var gradePointAverage =0;
            for(var i=0;i<userCourseDetails.length;i++){
                if(userCourseDetails[i].grade){
                    gradepoints = gradepoints + (userCourseDetails[i].units*gradeopts[userCourseDetails[i].grade]);
                    vm.totalUnitstaken = vm.totalUnitstaken + userCourseDetails[i].units;
                }
            }
            if(gradepoints){
                gradePointAverage = 2;
                gradePointAverage = gradepoints / vm.totalUnitstaken;
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
