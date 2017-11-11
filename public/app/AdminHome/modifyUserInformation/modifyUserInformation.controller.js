/**
 * Created by sayalidhumal on 8/13/17.
 */

(function () {
    angular.module('AdminHome').controller('modifyUserInformationController',modifyUserInformationController);

    modifyUserInformationController.$inject = ['UserService','$state'];

    function modifyUserInformationController(UserService,$state) {
        var vm =this;
        vm.form = {};
        vm.searchName = '';
        vm.searchID = '';
        vm.course = [];
        vm.user=[];
        vm.role="";
        vm.error = false;
        vm.view =view;
        vm.search = search;

        function view(user) {
            console.log(user)
            $state.go('root.admin.userDetails.viewUserDetails',{coyote_id: user.coyote_id,role:user.role});
        }

        function search(searchName,searchID) {
            vm.user = [];
            vm.error = false;
            UserService.getUser(searchID,searchName).then(
                function success(response) {
                    var user = response.data;
                    console.log(user)
                    if(user.length!=0){
                        angular.forEach(user,function (data,key) {
                            //console.log(key,data);
                            UserService.getUserRole(data.coyote_id).then(function success(response) {
                                vm.userRole = response.data[0];
                                data.role = vm.userRole;
                                vm.user.push(data);
                            }, function () {

                            })
                        })
                        console.log(vm.user)
                    }else {
                        vm.error = true;
                    }



                    // if(response.data.length !=0){
                    //     vm.user = response.data[0];
                    //     UserService.getUserRole(vm.user.coyote_id).then(function success(response) {
                    //         vm.role = response.data[0];
                    //     },function () {
                    //
                    //     })
                    // }else {
                    //     vm.error = true;
                    // }

                },function error(response) {
                    console.log(response);
                });
        }
    }
})();