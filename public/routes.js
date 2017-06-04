'use strict';

angular.module('myApp').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('login', {
        url: '/',
        views:{
          'login':{
            templateUrl: 'app/app.html',
            controller: 'AppCtrl',
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
          templateUrl:'app/applications/applications.html',
          controller:'Applications',
          controllerAs:'vm'
        }
      }
    })

    .state('root.toDo',{
      url:'todo-app',
      views:{
        'content@root':{
          templateUrl:'app/applications/todo/to-do.html',
          controller:'toDo',
          controllerAs:'vm'
        }
      }
    });
});
