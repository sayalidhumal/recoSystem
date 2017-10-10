/**
 * Created by Sanjay Karrolla on 9/8/2017.
 */

(function () {
    angular.module('AdminHome').controller('EditUserController',EditUserController);

    EditUserController.$inject = ['UserService','$stateParams','appconfig','$state'];

    function EditUserController(UserService,$stateParams,appconfig,$state) {
        var vm =this;
        vm.coyote_id = $stateParams.coyote_id;
        vm.user;
        // vm.user = {
        //     'password': null,
        //     'role': 'student',
        //     'name': '',
        //     "email_id": null,
        //     "phone": null,
        //     "coyote_id": vm.coyote_id,
        //     "address": {
        //         "Address": "",
        //         "City": "",
        //         "State": "",
        //         "Pin": ""
        //     },
        //     "date_of_birth": ""
        // }
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

            vm.user.phone = parseInt(vm.user.phone)
            console.log("submit",vm.user);
            UserService.updateUser(vm.user).then(
                function success(response) {
                    console.log("Successful operation")
                },
                function error() {

                })
        }

        function cancel() {
            $state.go('root.admin.userDetails');
        }
    }
})();