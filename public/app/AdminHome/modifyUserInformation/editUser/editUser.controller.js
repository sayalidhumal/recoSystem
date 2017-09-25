/**
 * Created by Sanjay Karrolla on 9/8/2017.
 */

(function () {
    angular.module('AdminHome').controller('EditUserController',EditUserController);

    EditUserController.$inject = ['UserService','$stateParams','appconfig','$state'];

    function EditUserController(UserService,$stateParams,appconfig,$state) {
        var vm =this;
        vm.coyote_id = $stateParams.coyote_id;
        vm.user = {}
        console.log("coyote",vm.coyote_id)
        vm.role = $stateParams.role;
        vm.submit = submit;
        vm.cancel = cancel;
        vm.myDate = new Date();
        vm.minDate = new Date(
            vm.myDate.getFullYear() - 100,
            vm.myDate.getMonth(),
            vm.myDate.getDate()
        );

        vm.maxDate = new Date(
            vm.myDate.getFullYear() - 10,
            vm.myDate.getMonth(),
            vm.myDate.getDate()
        );

        UserService.getUser(vm.coyote_id,null).then(
            function success(response) {

                vm.user = response.data[0];
                console.log(vm.user)
                console.log(vm.role)
            },
            function error() {

            })

        function submit() {
            UserService.postUser(vm.coyote_id,null).then(
                function success(response) {

                    vm.user = response.data[0];
                    console.log(vm.user)
                    console.log("role",vm.role)
                },
                function error() {

                })
        }

        function cancel() {
            $state.go('root.admin.userDetails');
        }
    }
})();