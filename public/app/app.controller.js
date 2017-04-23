(function(){
  angular.module('myApp').controller('AppCtrl',AppCtrl);
  AppCtrl.$inject=['$scope','$state','$http'];
  function AppCtrl($scope,$state,$http){
    var vm = this;
    vm.loginBtn = 'Login';
    vm.username=null;
    vm.password=null;
    vm.form={};
    vm.login = login;

    function login(){
      $http.post('/login',{username:vm.username, password: vm.password}).then(function(response) {
        console.log(response);
        if(response.data.success){
          console.log("success");
          $state.go('root.application');
        }
        else
          console.log("invalid login details"+ vm.userName + " " + vm.password);
      })
    }
  }
})();
