(function(){
  angular.module('myApp').controller('SignUpController',
  function($state,AuthService,UserService){
    var vm = this;
    vm.form = {}
    vm.user = {
      firstname: null,
      lastname:null,
      username:null,
      password:null
    }
    vm.create = create;
    vm.cancel = cancel;

    function create(){
      AuthService.createUser(vm.user).then(function(){
        console.log("user created successfully");
        $state.go('login');
      },
      function(reason){
        console.log(reason);
      })
    }

    function cancel(){
      $state.go('login');
    }
  })
})();
