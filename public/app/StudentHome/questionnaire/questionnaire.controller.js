/**
 * Created by sayalidhumal on 6/4/17.
 */
(function () {
    angular.module("Studenthome").controller("QuestionnaireController",QuestionnaireController);

    QuestionnaireController.$inject = ["QuestionnaireService","$stateParams","$state"];

    function QuestionnaireController(QuestionnaireService,$stateParams,$state) {
        var vm = this;
        vm.preference = {
            degree_preference:null,
            course_count_preference : null,
            lecture_preference:null,
            summer_course_preference: null,
            course_overload_preference: null,
            independent_study_preference: null,
            time_preference:[],
            day_preference:[],
            userID: $stateParams.userID
        }
        vm.role = $stateParams.userRole;
        console.log($stateParams.userID)
        vm.exists = exists;
        vm.toggle = toggle;
        vm.questionnaire = questionnaire;

        function questionnaire() {
            console.log(vm.preference)
            QuestionnaireService.addPreference(vm.preference).then(function () {
                $state.go('root',{userID : vm.preference.userID, userRole: vm.role});
            },function () {

            });
            // QuestionnaireService.addPreference(vm.preference).then(function(response) {
            //
            // },function (reason) {
            //
            // })
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