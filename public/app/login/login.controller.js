(function(){
    angular.module('Login').controller('LoginController',LoginController);

    LoginController.$inject=['$state','AuthService','$mdToast','$cookies'];

    function LoginController($state,AuthService,$mdToast,$cookies){
        var vm = this;
        vm.loginBtn = 'Login';
        vm.userID=null;
        vm.password=null;
        vm.form={};
        vm.error = false;
        vm.login = login;
        vm.register = register;

        function register(){
            $state.go('signup')
        }

        function login(){
            AuthService.authenticate(vm.userID).then(
                function success(response) {
                    vm.data = response.data[0];
                    if(response.data.length == 0){
                        $mdToast.showSimple("User not found")
                    }
                    else{
                        if(vm.data.password == vm.password){
                            $cookies.put('auth',vm.data.userID)
                            $cookies.put('role',vm.data.role)
                            $state.go('root',{userID : vm.data.userID, userRole: vm.data.role});
                        }
                        else{
                            $mdToast.showSimple("Invalid Password!")
                        }
                    }
            }, function error(response) {

            });
        }
    }
})();
