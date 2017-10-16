/**
 * Created by sayalidhumal on 10/12/17.
 */
(function(){
    angular.module("AdvisorHome").controller("AdvisorDetailViewController",AdvisorDetailViewController);

    AdvisorDetailViewController.$inject = ["$stateParams"];

    function AdvisorDetailViewController($stateParams) {
        var vm = this;
        vm.quarter = $stateParams.quarter;
        console.log(vm.quarter);
        vm.contains = constains;
        vm.day = ['M','T','W','TH','F']

        function constains(str,value,a) {
            return str.includes(value)
        }
    }

})();