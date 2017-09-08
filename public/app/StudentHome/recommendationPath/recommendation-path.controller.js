/**
 * Created by sayalidhumal on 6/4/17.
 */
(function () {
    angular.module("Studenthome").controller("RecommendationPathController",RecommendationPathController);

    RecommendationPathController.$inject = ["$http","$mdDialog","UserService","$stateParams","_"];

    function RecommendationPathController($http,$mdDialog,UserService,$stateParams,_) {
        var vm=this;
        vm.coyote_id = $stateParams.userID;
        vm.userDetails ={};
        vm.coursesRecommended = [
            {
                courseID:602,
                courseName:"Automata theory",
                totalUnits: 4

            },
            {
                courseID:655,
                courseName:"Software Engineering",
                totalUnits: 4
            }
        ]

        UserService.getRecommendationDetails(vm.coyote_id).then(
            function success(response) {
                console.log(response.data)
                vm.userDetails = response.data;
            },
            function error(response) {

        })

    }

})();