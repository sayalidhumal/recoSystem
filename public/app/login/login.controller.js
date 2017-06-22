(function(){
    angular.module('Login').controller('LoginController',LoginController);

    LoginController.$inject=['$scope','$state','$http','AuthService','appconfig'];

    function LoginController($scope,$state,$http,AuthService,appconfig){
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
            vm.userID = "'"+ vm.userID + "'";
            AuthService.authenticate(vm.userID).then(
                function success(response) {
                    console.log(response.data)
                    vm.data = response.data[0];
                    if(vm.data.password == vm.password){
                        if(vm.data.role == "admin"){
                            //$state.go('');
                        }
                        if(vm.data.role == "student"){
                            //$state.go('');
                        }
                        if(vm.data.role == "advisor"){
                            //$state.go('');
                        }
                    }

            }, function error(response) {

            });
        }
    }
})();
