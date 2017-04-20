angular.module('app',['ngResource','ngRoute']);

var app = angular.module('app').config(Route);

function Route($routeProvider, $locationProvider){
  $routeProvider
    .when('/',{
      templateUrl: '/partials/main',
      controller: 'mainCtrl'
    });
}

angular.module('app').controller('mainCtrl',function mainCtrl($scope){
  $scope.myVar = "Hello Angular";
});
