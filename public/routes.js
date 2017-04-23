'use strict';

angular.module('myApp', [
  'ui.router'
])
.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('root', {
        url: '/',
        views:{
          '@':{
            templateUrl: 'assets/layout/layout.html'
          },
          'content@root':{
            templateUrl: 'app/app.html',
            controller: 'AppCtrl',
            controllerAs:'vm'
          }
        }
    })

    .state('root.application',{
      url:'/home',
      views:{
        'content@root':{
          templateUrl:'app/applications/applications.html',
          controller:'Applications'
        }
      }
    })
})
.run(function () {

});
