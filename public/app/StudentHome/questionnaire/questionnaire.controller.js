/**
 * Created by sayalidhumal on 6/4/17.
 */
(function () {
    angular.module("Studenthome").controller("QuestionnaireController",QuestionnaireController);

    QuestionnaireController.$inject = ["$http","QuestionnaireService","$stateParams","$state"];

    function QuestionnaireController($http,QuestionnaireService,$stateParams,$state) {
        var vm = this;
        // vm.preference = {
        //     degree_preference:null,
        //     course_count_preference : null,
        //     lecture_preference:null,
        //     summer_course_preference: null,
        //     course_overload_preference: null,
        //     independent_study_preference: null,
        //     time_preference:[],
        //     day_preference:[],
        //     userID: $stateParams.userID
        // }
        vm.preference=[];
        vm.coyote_id= $stateParams.userID;
        // vm.exists = exists;
        // vm.toggle = toggle;
        vm.gradType = "Project";
        QuestionnaireService.getPreference(vm.coyote_id).then(function success(response) {
                vm.preference = response.data;
                vm.preference.preference = vm.preference.preference[0]
                vm.day = [];
                vm.time =[];
                for(var i =0;i<vm.preference.day_preference.length;i++){
                    console.log(i,vm.preference.day_preference[i], "preferences");
                    vm.day.push(vm.preference.day_preference[i].day_preference);
                }
                vm.preference.day_preference = vm.day;
                for(var i =0;i<vm.preference.time_preference.length;i++){
                    vm.time.push(vm.preference.time_preference[i].time_preference);
                }
                vm.preference.time_preference = vm.time;
                console.log(vm.preference, "preferences");
            },
            function error(reason) {
            }
        )
        
        // function exists(option,selected) {
        //     return selected.indexOf(option) > -1;
        // }
        //
        // function toggle(option,selected) {
        //     var idx = selected.indexOf(option);
        //     if (idx > -1) {
        //         selected.splice(idx, 1);
        //     }
        //     else {
        //         selected.push(option);
        //     }
        // }
    }

})();