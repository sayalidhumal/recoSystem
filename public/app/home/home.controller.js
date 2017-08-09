/**
 * Created by sayalidhumal on 6/4/17.
 */
(function () {
    angular.module("Home").controller("HomeController",HomeController);

    HomeController.$inject = ["$http","$stateParams"];

    function HomeController($http,$stateParams) {
         var vm=this;
         vm.role = $stateParams.userRole;
         console.log("StateParams",$stateParams)
    }

})();