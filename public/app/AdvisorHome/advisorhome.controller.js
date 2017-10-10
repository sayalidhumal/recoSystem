/**
 * Created by Sanjay Karrolla on 9/24/2017.
 */
/**
 * Created by sayalidhumal on 8/13/17.
 */
(function(){
    angular.module('AdvisorHome').controller('AdvisorHomeController',AdvisorHomeController);

    AdvisorHomeController.$inject=['$scope','$state','$http','AuthService','appconfig','$mdToast','UserService'];

    function AdvisorHomeController($scope,$state,$http,AuthService,appconfig,$mdToast,UserService){
        var vm = this;
        vm.view = view;
        vm.history= history;
        vm.recommendation= recommendation;
        console.log(vm.user);

        function history() {
            $state.go('root.advisor.advisorhome.educationalhistory');
        }

        function recommendation() {
            $state.go('root.advisor.advisorhome.recommendationpath');
        }

        function view() {
            $state.go('root.advisor.advisorhome.addprerequisites');
        }

    }
})();