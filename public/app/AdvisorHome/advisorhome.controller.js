/**
 * Created by Sanjay Karrolla on 9/24/2017.
 */
/**
 * Created by sayalidhumal on 8/13/17.
 */
(function(){
    angular.module('AdvisorHome').controller('AdvisorHomeController',AdvisorHomeController);

    AdvisorHomeController.$inject=['$stateParams','$state','$http','AuthService','appconfig','$mdToast','UserService'];

    function AdvisorHomeController($stateParams,$state,$http,AuthService,appconfig,$mdToast,UserService){
        var vm = this;
        vm.view = view;
        vm.history= history;
        vm.recommendation= recommendation;
        vm.coyote_id = $stateParams.coyote_id;
        console.log($stateParams)
        vm.role = $stateParams.Studentrole;
        UserService.getUser(vm.coyote_id,null).then(
            function success(response) {
                vm.user = response.data[0];
                console.log(vm.user)
            },
            function error() {

            })

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