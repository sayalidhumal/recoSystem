/**
 * Created by sayalidhumal on 10/17/17.
 */
(function(){
    angular.module('ResetPassword').controller('ResetPasswordController',ResetPasswordController);

    ResetPasswordController.$inject=['$state','AuthService','UserService','$mdToast','$cookies'];

    function ResetPasswordController($state,AuthService,UserService,$mdToast,$cookies){
        var vm =this;
        vm.email='';
        vm.coyoteID=null
        vm.code = null;
        vm.incorrectemail = false;
        vm.makeid = makeid;
        vm.visibleCode = false;
        vm.newPassword=''
        vm.confirmpassword=''

        vm.send = send;
        vm.change = change;

        function makeid() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }


        function change() {
           AuthService.changePassword(vm.newPassword,vm.coyoteID).then(
               function success(response) {
                   console.log('success',response)
                   $state.go('login');
                },function error() {

           })
            $state.go('login');
        }

        function send() {
            vm.incorrectemail = false;
            UserService.getUser(vm.coyoteID,"").then(
                function success(response) {
                    if(response.data[0]){
                        vm.user = response.data[0];
                        if(vm.user.email_id === vm.email){
                            vm.actualCode = vm.makeid();
                            AuthService.resetPassword(vm.email,vm.actualCode).then(
                                function success() {
                                    vm.visibleCode = true
                                },
                                function error() {

                                })
                        }else {
                            vm.incorrectemail = true;
                        }
                    }

                },function error() {

            })
        }
    }
})();