/**
 * Created by sayalidhumal on 10/12/17.
 */
(function(){
    angular.module("Studenthome").controller("StudentDetailViewController",StudentDetailViewController);

    StudentDetailViewController.$inject = ["$stateParams"];

    function StudentDetailViewController($stateParams) {
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