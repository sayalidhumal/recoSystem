(function(){
    angular.module('Login').controller('LoginController',LoginController);
    LoginController.$inject=['$scope','$state','$http','AuthService','appconfig'];
    function LoginController($scope,$state,$http,AuthService,appconfig){
        var vm = this;
        vm.loginBtn = 'Login';
        vm.username=null;
        vm.password=null;
        vm.form={};
        vm.error = false;
        vm.login = login;
        vm.register = register;

        function register(){
            $state.go('signup')
        }

        function login(){
            if(vm.username=="sayali"){
                $state.go('root')
            }
        }
    }
})();
