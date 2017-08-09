'use strict';

angular.module('myApp').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

        .state('welcome', {
            url: '/',
            views:{
                'welcome':{
                    templateUrl: 'app/welcome/welcome.html',
                    controller: 'WelcomeController',
                    controllerAs:'vm'
                }
            }
        })
        .state('login', {
            url: '/login',
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
          url:'/:userID',
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
          },
          params: {
              userID : null,
              userRole: null
          }
        })


        /************************ STUDENT ************************/

        .state('root.student',{
            url:''
        })
        .state('root.student.userCourseDetails',{
            url:'/course-details',
            views:{
                'content@root':{
                    templateUrl:'app/StudentHome/userCoursesDetails/user-courses-details.html',
                    controller:'UserCoursesController',
                    controllerAs:'vm'
                }
            }
        })
        .state('root.student.questionnaire',{
            url:'/recommendation-path',
            views:{
                'content@root':{
                    templateUrl:'app/StudentHome/questionnaire/questionnaire.html',
                    controller:'QuestionnaireController',
                    controllerAs:'vm'
                }
            }
        })

        .state('root.student.questionnaire.recommendationPath',{
            url:'',
            views:{
                'content@root':{
                    templateUrl:'app/StudentHome/recommendationPath/recommendation-path.html',
                    controller:'RecommendationPathController',
                    controllerAs:'vm'
                }
            }
        })

    /************************ ADMIN ************************/


    /************************ ADVISOR  ************************/

});
