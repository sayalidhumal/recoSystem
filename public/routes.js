'use strict';

angular.module('myApp').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('login', {
        url: '/',
        views:{
          'login':{
            templateUrl: 'app/login/login.html',
            controller: 'LoginController',
            controllerAs:'vm'
          }
        }
    })

    .state('signup',{
      url: '/signup',
      views:{
        'signup':{
          templateUrl:'app/signup/signup.html',
          controller:'SignUpController',
          controllerAs: 'vm'
        }
      }
    })

    .state('root',{
      url:'/',
      views:{
        '':{
          templateUrl: 'assets/layout/layout.html',
          controller: 'LayoutController',
          controllerAs:'vm'
        },
        'content@root':{
          templateUrl:'app/home/home.html',
          controller:'HomeController',
          controllerAs:'vm'
        }
      }
    })

});
