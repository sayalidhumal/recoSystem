(function(){
  angular.module('myApp').controller('AppCtrl',AppCtrl);
  AppCtrl.$inject=['$scope','$state','$http','AuthService','appconfig'];
  function AppCtrl($scope,$state,$http,AuthService,appconfig){
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
      AuthService.authenticate(vm.username,vm.password).then(function(success){
        if(success){
          appconfig.CurrentUser = vm.username;
          appconfig.CurrentUser;
          $state.go('root');
        }
        else{
          vm.error = true;
          console.log("invalid login details:"+ vm.userName + " " + vm.password);
        }
      });
    }
  }
})();
