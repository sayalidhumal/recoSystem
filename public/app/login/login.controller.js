(function(){
    angular.module('Login').controller('LoginController',LoginController);

    LoginController.$inject=['$state','AuthService','UserService','$mdToast','$cookies'];

    function LoginController($state,AuthService,UserService,$mdToast,$cookies){
        var vm = this;
        vm.loginBtn = 'Login';
        vm.userID=null;
        vm.password=null;
        vm.form={};
        vm.error = false;
        vm.data = {};
        vm.login = login;
        vm.register = register;
        vm.forgot =  forgot;

        function forgot() {
            $state.go('resetPassword');
        }

        function register(){
            $state.go('signup')
        }

        function login(){
            AuthService.authenticate(vm.userID).then(
                function success(response) {
                    vm.data = response.data[0];
                    console.log(vm.data)
                    if(response.data.length === 0){
                        vm.error = true;
                        $mdToast.showSimple("User not found")
                    }
                    else{

                        if(vm.data.password === vm.password){

                            UserService.getUserRole(vm.userID).then(
                                function success(response) {
                                    vm.role = response.data[0];
                                    cookieData = {
                                        auth: vm.data.userID,
                                        role: vm.role
                                    };
                                    $cookies.put('usedata',cookieData);
                                    $state.go('root',{userID : vm.data.coyote_id, userRole: vm.role});
                                },function error(response) {
                                    console.log(response)
                                }
                            )

                        }
                        else{
                            $mdToast.showSimple("Invalid Password!")
                        }
                    }
            }, function error(response) {
                console.log(response)
            });
        }
    }
})();
