/**
 * Created by sayalidhumal on 6/4/17.
 */
(function () {
    angular.module("Home").controller("HomeController",HomeController);

    HomeController.$inject = ["$http"];

    function HomeController($http) {
        $http({
            method: 'GET',
            url: '/getPhysicalClubs'
        }).then(function success(response){
            console.log("Data from database",response.data)
        },function error(error){

        });
    }
})();