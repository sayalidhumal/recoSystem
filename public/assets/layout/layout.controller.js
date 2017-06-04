(function(){
  angular.module('myApp').controller('LayoutController',
  function(appconfig,AuthService,$state){
    var vm = this;
    vm.user = appconfig.CurrentUser;
    vm.signOut = signOut;

    function signOut(){
      AuthService.logoutUser().then(function(){
        console.log("successfully logged out");
        $state.go('login');
      })
    }
  })
})();
