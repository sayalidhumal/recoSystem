(function(){
  angular.module('Signup').controller('SignUpController',
  function($state,AuthService,UserService){
    var vm = this;
    vm.form = {}
      vm.user = {
          'password': null,
          'role': 'student',
          'name':{
              "FirstName": null,
              "LastName": null,
              "MiddleName": null
          },
          "email": null,
          "phone": null,
          "userID": null,
          "address":{
              "Address": "",
              "City": "",
              "State": "",
              "Pin": ""
          },
          "dateOfBirth": ""
      }
    vm.create = create;
    vm.cancel = cancel;

    function create(){
        console.log(vm.user)
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
