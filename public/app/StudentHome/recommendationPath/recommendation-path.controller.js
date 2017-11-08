/**
 * Created by sayalidhumal on 6/4/17.
 */
(function () {
    angular.module("Studenthome").controller("RecommendationPathController",RecommendationPathController);

    RecommendationPathController.$inject = ["UserService","$stateParams","_","appconfig","CourseService","$filter","RecommendationAlgo","$state"];

    function RecommendationPathController(UserService,$stateParams,_,appconfig,CourseService,$filter,RecommendationAlgo,$state) {
        var vm=this;
        vm.coyote_id = $stateParams.userID;
        vm.currentYear = appconfig.CurrentYear;
        vm.currentMonth = $filter('date')(new Date(), 'MMMM');
        vm.currentQuarter = appconfig.QUARTERS[vm.currentMonth];
        vm.quarterOrder = appconfig.QuarterOrder;
        vm.userDetails ={};
        vm.coursesData ={};
        vm.userCourse = [];
        vm.recommendationPath= {};
        vm.optionalSubjects=[];
        vm.optionalSchedule ={};
        vm.electiveCount = 0;
        vm.added = 0;

        vm.view = view;

        UserService.getRecommendationDetails(vm.coyote_id).then(
            function success(response) {
                vm.userDetails = response.data;
                console.log(vm.userDetails)
                // if(vm.userDetails.path == null){
                    CourseService.getAllCourses(vm.currentYear).then(
                        function success(reponse) {
                            vm.coursesData = reponse.data;
                            /****  Grouping the courses and schedule  ***/
                            vm.schedule = _.groupBy(vm.coursesData.schedule,'course_id');

                            for(var i=0;i<vm.coursesData.core.length;i++){
                                vm.coursesData.core[i].schedule = vm.schedule[vm.coursesData.core[i].course_id];
                                for(var j=0;j<vm.coursesData.core[i].schedule.length;j++){
                                    vm.coursesData.core[i].schedule[j].name = vm.coursesData.core[i].name;
                                    vm.coursesData.core[i].schedule[j].units = vm.coursesData.core[i].units;
                                    vm.coursesData.core[i].schedule[j].type = "core";
                                }

                            }

                            for(var i=0;i<vm.coursesData.electives.length;i++){
                                vm.coursesData.electives[i].schedule = vm.schedule[vm.coursesData.electives[i].course_id];
                                if(vm.coursesData.electives[i].schedule)
                                    for(var j=0;j<vm.coursesData.electives[i].schedule.length;j++){
                                        vm.coursesData.electives[i].schedule[j].name = vm.coursesData.electives[i].name;
                                        vm.coursesData.electives[i].schedule[j].units = vm.coursesData.electives[i].units;
                                        vm.coursesData.electives[i].schedule[j].type = "elective";
                                    }
                            }

                            for(var i=0;i<vm.coursesData.prerequisites.length;i++){
                                vm.coursesData.prerequisites[i].schedule = vm.schedule[vm.coursesData.prerequisites[i].prerequisite_id];
                                for(var j=0;j<vm.coursesData.prerequisites[i].schedule.length;j++){
                                    vm.coursesData.prerequisites[i].schedule[j].name = vm.coursesData.prerequisites[i].name;
                                    vm.coursesData.prerequisites[i].schedule[j].units = vm.coursesData.prerequisites[i].units;
                                    vm.coursesData.prerequisites[i].schedule[j].type = "prerequisite";
                                }
                            }

                            var path = RecommendationAlgo.createPath(vm.userDetails,vm.coursesData);
                            vm.recommendationPath = path[0].path;
                            vm.optionalSubjects = path[0].optionalElective;
                            console.log(vm.recommendationPath)

                            UserService.addRecommendationPath(path,vm.coyote_id).then(
                                function success(response) {
                                        console.log("Path Added Successfully")
                                },
                                function error() {
                            })
                        },function error(response) {

                        }
                    )
               // }
                // else{
                //     vm.recommendationPath = vm.userDetails.path[0].path;
                //     vm.optionalSubjects = path[0].optionalElective;
                // }
            },
            function error(response) {

        });

        function view(quarter,year) {
            quarter.year = year;
            $state.go('root.student.recommendationPath.detailView',{quarter: quarter});
        }
    }


})();
