(function(){
  var app = angular.module('myApp',[
      'ui.router',
      'ngMaterial',
      'ngCookies',
      'services',
      'directives',
      'underscore',
      'ngResource',
      'RecommendationAlgorithm',
      'Login',
      'ResetPassword',
      'Signup',
      'Home',
      'Studenthome',
      'AdminHome',
      'md.data.table',
      'AdvisorHome'
  ])


  /* To be added to set it to current DD/MM/YYYY

      * 'CurrentDate': new Date(),
      * 'CurrentMonth': (new Date()).getMonth(),
      *'CurrentYear': (new Date()).getFullYear(),
      *'NextYear': (new Date()).getFullYear() + 1,
      *
      * */

  .constant('appconfig',{
    'TIMEOUT': 1800000,
    'QUARTERS': {
        January: 'Winter',
        February: 'Winter',
        March: 'Winter',
        April: 'Spring',
        May: 'Spring',
        June: 'Spring',
        July: 'Summer',
        August: 'Summer',
        September: 'Fall',
        October: 'Fall',
        November: 'Fall',
        December: 'Fall'
    },
      'QuarterOrder':["Fall","Winter","Spring","Summer"],
     'CurrentDate': new Date(),
      'CurrentMonth': (new Date()).getMonth(),
      'CurrentYear': 2015,
      'NextYear': 2016,
    'DegreeRequirements':[
        {
            "degreeType":"Project",
            "electiveUnits": 20,
            "max500LevelElectives": 8,
            "courseOption": {
                "course_id": 690,
                "course_dept":"CSE"
            }
        },
        {
            "degreeType":"Comprehensive Exam",
            "electiveUnits": 24,
            "max500LevelElectives": 8,
            "courseOption": {
                "course_id": 689,
                "course_dept":"CSE"
            }
        },
        {
            "degreeType":"Thesis",
            "electiveUnits": 16,
            "max500LevelElectives": 8,
            "courseOption": {
                "course_id": 699,
                "course_dept":"CSE"
            }
        }
    ]



  })//app.constant

  .run(function ($rootScope, $location, $state, $stateParams, $timeout, $document, appconfig , $cookies, $http) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    var eventArray = ['keydown','keyup','click','dblclick','movemouse','DOMMouseScroll','mousewheel','mousedown','touchstart','touchmove','scroll','focus','change','select'];
    var maxIdleSession = appconfig.TIMEOUT;
    var bodyElement = angular.element($document);


    $rootScope.$on('$stateChangeStart',function(event,toState){
      var timeOutThread = $timeout(function(){logOutSession();},maxIdleSession);
      if(toState.name!='login'){
          angular.forEach(eventArray,function(eventName){
              bodyElement.on(eventName,function(e){
                  ResetIdleSession(e);

              })
          })
      }
      else if (toState.name=='login') {
        unbindTimerEvents();
      }
      function ResetIdleSession(e){
        $timeout(function(){logOutSession();},maxIdleSession);
      }
      function logOutSession(){
        appconfig.CurrentUser = null;
        unbindTimerEvents();
        $state.go('login');
      }
      function unbindTimerEvents(){
        $timeout.cancel(timeOutThread);
        angular.forEach(eventArray,function(eventName){
          bodyElement.off(eventName);
        })
      }
    })//$rootScope.$on('$stateChangeStart')

    $rootScope.$on('$stateChangeSuccess',function(event,toState,toParams,fromState,fromParams){
      $state.go(toState);


    })//$rootScope.$on('$stateChangeSuccess')
  });//app.run()
})();
