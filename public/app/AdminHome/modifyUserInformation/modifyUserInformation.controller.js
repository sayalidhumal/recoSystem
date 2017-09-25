/**
 * Created by sayalidhumal on 8/13/17.
 */

(function () {
    angular.module('AdminHome').controller('modifyUserInformationController',modifyUserInformationController);

    modifyUserInformationController.$inject = ['UserService','$state'];

    function modifyUserInformationController(UserService,$state) {
        var vm =this;
        vm.form = {};
        vm.searchName = '';
        vm.searchID = '';
        vm.search = search;
        vm.course = [];
        vm.user=[];
        vm.role=""
        vm.view =view;

        function view(user) {
            console.log(user)
            $state.go('root.admin.userDetails.viewUserDetails',{coyote_id: vm.user.coyote_id,role:vm.role});
        }

        function search(searchName,searchID) {
            UserService.getUser(searchID,searchName).then(
                function success(response) {
                    vm.user = response.data[0];
                    console.log(vm.user);
                    UserService.getUserRole(vm.user.coyote_id).then(function success(response) {
                        vm.role = response.data[0];
                    },function () {

                    })

                },function error(response) {
                    console.log(response);
                });
        }
    }
})();