/**
 * Created by sayalidhumal on 6/4/17.
 */
(function () {
    angular.module("Studenthome").controller("QuestionnaireController",QuestionnaireController);

    QuestionnaireController.$inject = ["$http","QuestionnaireService","$stateParams","$state"];

    function QuestionnaireController($http,QuestionnaireService,$stateParams,$state) {
        var vm = this;
        vm.preference = {
            gradType:null,
            lectureDays : [],
            lectureTimes:[],
            lectureType: null,
            userID: $stateParams.userID
        }
        console.log($stateParams.userID)
        vm.exists = exists;
        vm.toggle = toggle;
        vm.questionnaire = questionnaire;

        function questionnaire() {
            console.log(vm.preference)
            /*QuestionnaireService.addPreference(vm.preference).then(function(response) {
                $state.go('root.student.questionnaire.recommendationPath');
            },function (reason) {

            })*/
        }
        
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
    }

})();