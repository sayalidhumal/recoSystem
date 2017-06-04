(function(){
  var app = angular.module('myApp',[
    'ui.router',
    'ngMaterial',
    'services',
    'ngResource'
  ])
  .constant('appconfig',{
    'TIMEOUT': 1800000,
    'CurrentUser': null
  })//app.constant

  .run(function ($rootScope, $location, $state, $stateParams, $timeout, $document, appconfig , $mdToast, $http) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    var eventArray = ['keydown','keyup','click','dblclick','movemouse','DOMMouseScroll','mousewheel','mousedown','touchstart','touchmove','scroll','focus','change','select'];
    var maxIdleSession = appconfig.TIMEOUT;
    var bodyElement = angular.element($document);


    $rootScope.$on('$stateChangeStart',function(event,toState){
      var timeOutThread = $timeout(function(){logOutSession();},maxIdleSession);
      if(toState.name!='login'){
        console.log("success from app.js")
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
      var campusResource;
        $http({
            method: 'GET',
            url: '/getPhysicalClubs'
        }).then(function success(response){
            console.log("Data from database",response.data)
            campusResource = response.data;
        },function error(error){

        });
      console.log("changing the state");
      $state.go(toState);
    })//$rootScope.$on('$stateChangeSuccess')
  });//app.run()
})();