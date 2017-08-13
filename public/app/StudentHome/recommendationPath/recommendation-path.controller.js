/**
 * Created by sayalidhumal on 6/4/17.
 */
(function () {
    angular.module("Studenthome").controller("RecommendationPathController",RecommendationPathController);

    RecommendationPathController.$inject = ["$http","$mdDialog","$scope"];

    function RecommendationPathController($http,$mdDialog,$scope) {
        var vm=this;
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
    }

})();