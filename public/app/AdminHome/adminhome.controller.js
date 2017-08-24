/**
 * Created by sayalidhumal on 8/13/17.
 */
(function(){
    angular.module('AdminHome').controller('AdminHomeController',AdminHomeController);

    AdminHomeController.$inject=['$scope','$state','$http','AuthService','appconfig','$mdToast'];

    function AdminHomeController($scope,$state,$http,AuthService,appconfig,$mdToast){
        var vm = this;

    }
})();