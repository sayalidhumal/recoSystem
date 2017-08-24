/**
 * Created by sayalidhumal on 8/13/17.
 */

(function () {
    angular.module('AdminHome').controller('createUserController',createUserController);

    createUserController.$inject = ['AuthService','$state'];

    function createUserController(AuthService,$state) {
        var vm =this;
        vm.form = {}
        vm.firstname ='';
        vm.lastname ='';
        vm.middlename = '';
        vm.user = {
            'password': null,
            'name': '',
            "email": null,
            "phone": null,
            "userID": null,
            "address": {
                "Address": "",
                "City": "",
                "State": "",
                "Pin": ""
            },
            "dateOfBirth": "",
            "role":''
        }
        vm.states = ('AL AK AZ AR WY CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
        'CA').split(' ').map(function (state) {
            return {abbrev: state};
        });
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

        vm.create = create;

        function create() {
            if(vm.middlename==''){
                vm.user.name = vm.firstname + " " + vm.lastname;
            }
            else {
                vm.user.name = vm.firstname + " " + vm.middlename + " " + vm.lastname;
            }
            console.log(vm.user);
            AuthService.createUser(vm.user).then(function(response) {
                    console.log("user created successfully");
                    $state.go('root');
                },
                function error(reason) {
                    console.log(reason);
                })
        }
    }
})();