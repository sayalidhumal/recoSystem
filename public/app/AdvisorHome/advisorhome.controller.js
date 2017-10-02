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
        console.log(vm.user);




        function view() {
            $state.go('root.advisor.advisorhome.addprerequisites');
        }

    }
})();