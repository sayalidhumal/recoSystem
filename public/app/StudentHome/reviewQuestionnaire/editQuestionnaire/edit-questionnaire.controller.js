/**
 * Created by sayalidhumal on 6/4/17.
 */
(function () {
    angular.module("Studenthome").controller("EditQuestionnaireController",EditQuestionnaireController);

    EditQuestionnaireController.$inject = ["$http","QuestionnaireService","$stateParams","$state","_","$scope","UserService","CourseService","appconfig","RecommendationAlgo"];

    function EditQuestionnaireController($http,QuestionnaireService,$stateParams,$state,_,$scope,UserService,CourseService,appconfig,RecommendationAlgo) {
        var vm = this;
        vm.currentYear = appconfig.CurrentYear;
        vm.preference={
            preference:{},
            day_preference:[],
            time_preference:[]
        };
        console.log($stateParams)
        vm.coyote_id = $stateParams.userID;
        vm.exists = exists;
        vm.toggle = toggle;
        vm.update = update;
        QuestionnaireService.getPreference(vm.coyote_id).then(function success(response) {
                vm.data = response.data;
                vm.preference.preference = vm.data.preference[0];
                vm.day = [];
                vm.time =[];
                for(i =0;i<vm.data.day_preference.length;i++){
                    vm.day.push(vm.data.day_preference[i].day_preference);
                }
                vm.preference.day_preference = vm.day;
                for(i =0;i<vm.data.time_preference.length;i++){
                    vm.time.push(vm.data.time_preference[i].time_preference);
                }
                vm.preference.time_preference = vm.time;
                vm.preference.preference.course_count_preference = parseInt(vm.preference.preference.course_count_preference);
                console.log(vm.preference)
                vm.oldPreference = angular.copy(vm.preference);
            },
            function error(reason) {

            }
        );
        var dayTime = ['vm.preference.day_preference','vm.preference.time_preference'];
        $scope.$watchGroup(['vm.preference.day_preference','vm.preference.time_preference'], function (oldValue,newValue) {
                console.log("Old",oldValue,"new",newValue)
        })

        function exists(option,selected) {
            return selected.indexOf(option) > -1;
        }

        function toggle(option,selected) {
            var idx = selected.indexOf(option);
            if (idx > -1) {
                selected.splice(idx, 1);
            }
            else {
                selected.push(option);
            }
        }

        function update() {

            if(!_.isEqual(vm.oldPreference,vm.preference)){
                vm.preference.preference.coyote_id = parseInt(vm.preference.preference.coyote_id);
                vm.preference.preference.course_overload_preference = (parseInt(vm.preference.preference.course_overload_preference)==1||vm.preference.preference.course_overload_preference==true) ? true:false;
                vm.preference.preference.independent_study_preference = (parseInt(vm.preference.preference.independent_study_preference)==1||vm.preference.preference.independent_study_preference==true) ? true:false;
                vm.preference.preference.lecture_preference = (parseInt(vm.preference.preference.lecture_preference)==1 ||vm.preference.preference.lecture_preference==true) ? true:false;
                vm.preference.preference.summer_course_preference = (parseInt(vm.preference.preference.summer_course_preference)==1 || vm.preference.preference.summer_course_preference==true) ? true:false;
                QuestionnaireService.updatePreference(vm.preference).then(function success() {
                    console.log("success")
                    UserService.getRecommendationDetails(vm.coyote_id).then(
                        function success(response) {
                            console.log("",response.data);
                            vm.userDetails = response.data;

                            CourseService.getAllCourses(vm.currentYear).then(
                                function success(reponse) {
                                    vm.coursesData = reponse.data;
                                    /****  Grouping the courses and schedule  ***/
                                    vm.schedule = _.groupBy(vm.coursesData.schedule,'course_id');

                                    for(var i=0;i<vm.coursesData.core.length;i++){
                                        vm.coursesData.core[i].schedule = vm.schedule[vm.coursesData.core[i].course_id];
                                        for(var j=0;j<vm.coursesData.core[i].schedule.length;j++){
                                            vm.coursesData.core[i].schedule[j].name = vm.coursesData.core[i].name;
                                            vm.coursesData.core[i].schedule[j].units = vm.coursesData.core[i].units
                                        }

                                    }

                                    for(var i=0;i<vm.coursesData.electives.length;i++){
                                        vm.coursesData.electives[i].schedule = vm.schedule[vm.coursesData.electives[i].course_id];
                                        if(vm.coursesData.electives[i].schedule)
                                            for(var j=0;j<vm.coursesData.electives[i].schedule.length;j++){
                                                vm.coursesData.electives[i].schedule[j].name = vm.coursesData.electives[i].name;
                                                vm.coursesData.electives[i].schedule[j].units = vm.coursesData.electives[i].units
                                            }
                                    }

                                    for(var i=0;i<vm.coursesData.prerequisites.length;i++){
                                        vm.coursesData.prerequisites[i].schedule = vm.schedule[vm.coursesData.prerequisites[i].prerequisite_id];
                                        for(var j=0;j<vm.coursesData.prerequisites[i].schedule.length;j++){
                                            vm.coursesData.prerequisites[i].schedule[j].name = vm.coursesData.prerequisites[i].name;
                                            vm.coursesData.prerequisites[i].schedule[j].units = vm.coursesData.prerequisites[i].units
                                        }
                                    }

                                    var path = RecommendationAlgo.createPath(vm.userDetails,vm.coursesData);
                                    vm.recommendationPath = path[0].path;
                                    console.log(path);

                                    UserService.addRecommendationPath(path,vm.coyote_id).then(function success(response) {

                                    },function error() {

                                    })


                                    //  prerequisites(vm.userDetails,vm.coursesData.core,vm.coursesData.prerequisites);
                                    //
                                    //  core(vm.userDetails,vm.coursesData.core,vm.coursesData.prerequisites);
                                    //
                                    // elective(vm.userDetails,vm.coursesData.electives,vm.coursesData.constraints);
                                    //
                                    // vm.recommendationPath = formatForDisplay(vm.recommendationPath);
                                    //
                                    //  console.log(vm.recommendationPath)

                                },function error(response) {

                                }
                            )
                        },
                        function error(response) {

                        });
                    $state.go('root.student.reviewquestionnaire');
                },function error() {

                })
            }
            console.log(vm.preference)
        }

    }

})();