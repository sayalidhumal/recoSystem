/**
 * Created by sayalidhumal on 6/4/17.
 */
(function () {
    angular.module("Home").controller("HomeController",HomeController);

    HomeController.$inject = ['$http','$stateParams','UserService','$state'];

    function HomeController($http,$stateParams,UserService,$state) {
        var vm = this;
        vm.role = $stateParams.userRole;
        console.log("StateParams", $stateParams)
        vm.form = {};
        vm.searchName = '';
        vm.searchID = '';
        vm.search = search;
        vm.course = [];
        vm.userRole = [];
        vm.view = view;
        vm.user =[];

        function view(user) {
            console.log(user)
            $state.go('root.advisor.advisorhome', {coyote_id: vm.user.coyote_id, role: vm.role});
        }

        function search(searchName, searchID) {
            UserService.getUser(searchID, searchName).then(
                function success(response) {
                    vm.user = response.data[0];
                    console.log(vm.user);
                    UserService.getUserRole(vm.user.coyote_id).then(function success(response) {
                        vm.userRole = response.data[0];
                    }, function () {

                    })

                }, function error(response) {
                    console.log(response);
                });
        }
    }

})();