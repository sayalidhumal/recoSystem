/**
 * Created by Sanjay Karrolla on 9/8/2017.
 */
/**
 * Created by sayalidhumal on 8/13/17.
 */

(function () {
    angular.module('AdminHome').controller('ViewUserController',ViewUserController);

    ViewUserController.$inject = ['UserService','$stateParams','appconfig','$state','$mdDialog'];

    function ViewUserController(UserService,$stateParams,appconfig,$state,$mdDialog) {
        var vm =this;
        vm.coyote_id = $stateParams.coyote_id;
        vm.user = {}
        vm.role = $stateParams.role;
        vm.edit = edit;
        vm.deleteUser = deleteUser;

        function deleteUser(ev) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete '+vm.user.name+' details?')
                .ariaLabel('delete user')
                .targetEvent(ev)
                .ok('DELETE')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function() {
                UserService.deleteUser(vm.coyote_id).then(function success() {
                    $state.go('root.admin.userDetails')
                },function error() {

                })
            }, function() {
                console.log("cancel")
            });
        }

        function edit() {
            $state.go('root.admin.userDetails.viewUserDetails.editUserDetails',{coyote_id: vm.user.coyote_id,role:vm.role});
        }

        UserService.getUser(vm.coyote_id,null).then(
            function success(response) {

                vm.user = response.data[0];
                console.log(vm.user)
                console.log(vm.role)
            },
            function error() {

            })




    }
})();