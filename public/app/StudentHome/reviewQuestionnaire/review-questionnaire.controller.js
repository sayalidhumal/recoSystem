/**
 * Created by sayalidhumal on 6/4/17.
 */
(function () {
    angular.module("Studenthome").controller("ReviewQuestionnaireController",ReviewQuestionnaireController);

    ReviewQuestionnaireController.$inject = ["$http","QuestionnaireService","$stateParams","$state","_"];

    function ReviewQuestionnaireController($http,QuestionnaireService,$stateParams,$state,_) {
        var vm = this;

        vm.preference=[];
        vm.coyote_id = $stateParams.userID;
         vm.contains = constains;
         vm.edit = edit;
        // vm.toggle = toggle;
        vm.gradType = "Project";
        QuestionnaireService.getPreference(vm.coyote_id).then(function success(response) {
                vm.preference = response.data;
                vm.preference.preference = vm.preference.preference[0];
                vm.day = [];
                vm.time =[];
                for(i =0;i<vm.preference.day_preference.length;i++){
                    vm.day.push(vm.preference.day_preference[i].day_preference);
                }
                vm.preference.day_preference = vm.day;
                for(i =0;i<vm.preference.time_preference.length;i++){
                    vm.time.push(vm.preference.time_preference[i].time_preference);
                }
                vm.preference.time_preference = vm.time;
                vm.preference.preference.course_count_preference = parseInt(vm.preference.preference.course_count_preference);
                console.log(vm.preference)
            },
            function error(reason) {

            }
        );

        function edit(coyote_id) {
            $state.go('root.student.reviewquestionnaire.editquestionnaire',{coyote_id : coyote_id});
        }

        function constains(array,value) {
            return _.contains(array,value)
        }

    }

})();