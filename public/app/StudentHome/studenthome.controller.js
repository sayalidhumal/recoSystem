/**
 * Created by Sanjay Karrolla on 6/21/2017.
 */
(function(){
    angular.module('StudentHome').controller('StudentHomeController',StudentHomeController);

    StudentHomeController.$inject=['$scope','$state','$http','AuthService','appconfig','$mdToast'];

    function StudentHomeController($scope,$state,$http,AuthService,appconfig,$mdToast){
        var vm = this;

    }
})();
