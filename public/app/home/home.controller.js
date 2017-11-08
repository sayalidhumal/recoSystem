/**
 * Created by sayalidhumal on 6/4/17.
 */
(function () {
    angular.module("Home").controller("HomeController",HomeController);

    HomeController.$inject = ['$http','$stateParams','UserService','$state'];

    function HomeController($http,$stateParams,UserService,$state) {
        var vm = this;
        vm.role = $stateParams.userRole;

        vm.form = {};
        vm.searchName = '';
        vm.searchID = '';
        vm.search = search;
        vm.course = [];
        vm.userRole = [];
        vm.view = view;
        vm.user =[];
        vm.flag = false;

        function view(user) {
            $state.go('root.advisor.advisorhome', {coyote_id: user.coyote_id, Studentrole: user.role});
        }

        function search(searchName, searchID) {
            vm.flag = true;
            vm.user =[];
            UserService.getUser(searchID, searchName).then(
                function success(response) {
                    var user = response.data;
                    if(user){
                        angular.forEach(user,function (data,key) {
                            //console.log(key,data);
                            UserService.getUserRole(data.coyote_id).then(function success(response) {
                                vm.userRole = response.data[0];
                                data.role = vm.userRole;
                                if(vm.userRole=="student"){
                                    vm.user.push(data);
                                }
                            }, function () {

                            })
                        })
                        console.log(vm.user)
                    }


                    // var user = response.data[0];
                    // if(user){
                    //     UserService.getUserRole(user.coyote_id).then(function success(response) {
                    //         vm.userRole = response.data[0];
                    //
                    //         if(vm.userRole !== 'student'){
                    //             vm.user = undefined;
                    //         }
                    //         else
                    //             vm.user = user
                    //     }, function () {
                    //
                    //     })
                    // }

                }, function error(response) {
                    console.log(response);
                });
        }
    }

})();