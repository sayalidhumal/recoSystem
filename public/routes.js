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
          url:'/:userRole/:userID',
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
            url:'/user-course-details',
            views:{
                'content@root':{
                    templateUrl:'app/StudentHome/userCoursesDetails/user-courses-details.html',
                    controller:'UserCoursesController',
                    controllerAs:'vm'
                }
            }
        })

        .state('root.student.questionnaire',{
            url:'/questionnaire',
            views:{
                'content@root':{
                    templateUrl:'app/StudentHome/questionnaire/questionnaire.html',
                    controller:'QuestionnaireController',
                    controllerAs:'vm'
                }
            },
            params:{
                userID : null,
                userRole: null
            }
        })

        .state('root.student.recommendationPath',{
            url:'/recommendation-path',
            views:{
                'content@root':{
                    templateUrl:'app/StudentHome/recommendationPath/recommendation-path.html',
                    controller:'RecommendationPathController',
                    controllerAs:'vm'
                }
            }
        })

    /************************ ADMIN ************************/

        .state('root.admin',{
            url:''
        })
        .state('root.admin.userDetails',{
            url:'/user-details',
            views:{
                'content@root':{
                    templateUrl:'app/AdminHome/modifyUserInformation/modifyUserInformation.html',
                    controller:'modifyUserInformationController',
                    controllerAs:'vm'
                }
            }
        })

        .state('root.admin.userDetails.viewUserDetails',{
            url:'/:coyote_id',
            views:{
                'content@root':{
                    templateUrl:'app/AdminHome/modifyUserInformation/viewUser/viewUser.html',
                    controller:'ViewUserController',
                    controllerAs:'vm'
                }
            },
            params: {
                coyote_id : null,
                role: null
            }
        })

        .state('root.admin.userDetails.viewUserDetails.editUserDetails',{
            url:'/edit',
            views:{
                'content@root':{
                    templateUrl:'app/AdminHome/modifyUserInformation/editUser/editUser.html',
                    controller:'EditUserController',
                    controllerAs:'vm'
                }
            },
            params: {
                coyote_id : null,
                role: null
            }
        })

        .state('root.admin.createUser',{
            url:'/create-user',
            views:{
                'content@root':{
                    templateUrl:'app/AdminHome/createUser/createUser.html',
                    controller:'createUserController',
                    controllerAs:'vm'
                }
            }
        })

        .state('root.admin.courseDetails',{
            url:'/course-details',
            views:{
                'content@root':{
                    templateUrl:'app/AdminHome/modifyCourseInformation/modifyCourseInformation.html',
                    controller:'modifyCourseInformationController',
                    controllerAs:'vm'
                }
            }
        })

        .state('root.admin.courseDetails.viewCourseDetails',{
            url:'/:courseID',
            views:{
                'content@root':{
                    templateUrl:'app/AdminHome/modifyCourseInformation/viewCourse/viewCourse.html',
                    controller:'ViewCourseController',
                    controllerAs:'vm'
                }
            },
            params: {
                courseID : null
            }
        })

        .state('root.admin.courseDetails.viewCourseDetails.editCourseDetails',{
            url:'/edit',
            views:{
                'content@root':{
                    templateUrl:'app/AdminHome/modifyCourseInformation/editCourse/editCourse.html',
                    controller:'EditCourseController',
                    controllerAs:'vm'
                }
            },
            params: {
                schedule:null
            }
        })

        .state('root.admin.createCourse',{
            url:'/create-course',
            views:{
                'content@root':{
                    templateUrl:'app/AdminHome/createCourse/createCourse.html',
                    controller:'createCourseController',
                    controllerAs:'vm'
                }
            }
        })

    /************************ ADVISOR  ************************/

        .state('root.advisor',{
            url:''
        })
        .state('root.advisor.advisorhome',{
            url:'/user/:coyote_id',
            views:{
                'content@root':{
                    templateUrl:'app/AdvisorHome/advisorHome.html',
                    controller:'AdvisorHomeController',
                    controllerAs:'vm'
                }
            },
            params: {
                coyote_id : null,
                role: null
            }
        })

        .state('root.advisor.advisorhome.addprerequisites',{
            url:'/addprerequisite',
            views:{
                'content@root':{
                    templateUrl:'app/AdvisorHome/addPrerequisites/addPrerequisites.html',
                    controller:'addPrerequisitesController',
                    controllerAs:'vm'
                }
            }
        })



});
