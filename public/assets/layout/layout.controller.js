(function(){
  angular.module('myApp')
      .controller('LayoutController',
          function(appconfig,AuthService,$state,$scope,$mdSidenav,$log,$stateParams,$rootElement,UserService,$cookies){
              var vm = this;
              vm.coyote_id = $stateParams.userID;
              vm.signOut = signOut;
              $scope.toggleLeft = buildToggler('left');
              $rootElement.menu = []
              vm.menu = $rootElement.menu;

              UserService.getUser(vm.coyote_id, null).then(
                  function success(response) {
                      var user = response.data[0];
                      if(user){
                          UserService.getUserRole(user.coyote_id).then(function success(response) {
                              vm.userRole = response.data[0];
                              vm.user = user
                              console.log(vm.user,vm.userRole);
                          }, function () {

                          })
                      }

                  }, function error(response) {
                      console.log(response);
                  });

              if($stateParams.userRole === 'advisor'){
                  vm.menu = [
                        {
                            "cardName": 'Educational History',
                            "route": 'root.advisor.advisorhome.educationalhistory'
                        },
                        {
                            "cardName": 'Add Prerequisites',
                            "route": 'root.advisor.advisorhome.addprerequisites'
                        },
                        {
                            "cardName": 'View Recommendation path',
                            "route": 'root.advisor.advisorhome.recommendationpath'
                        }
                    ]
              }
              if($stateParams.userRole === 'student'){
                  vm.menu = [
                      {
                          "cardName": 'Course History',
                          "route": 'root.student.userCourseDetails'
                      },
                      {
                          "cardName": 'Recommendation Path',
                          "route": 'root.student.recommendationPath'
                      },
                      {
                          "cardName": 'Review Questionnaire',
                          "route": 'root.student.reviewquestionnaire'
                      }
                  ]
              }
              if($stateParams.userRole === 'administrator'){
                  vm.menu = [
                      {
                          "cardName": 'Search and Modify User Information',
                          "route": 'root.admin.userDetails'
                      },
                      {
                          "cardName": 'Create New User',
                          "route": 'root.admin.createUser'
                      },
                      {
                          "cardName": 'Search and Modify Course Information',
                          "route": 'root.admin.courseDetails'
                      },
                      {
                          "cardName": 'Create New Course',
                          "route": 'root.admin.createCourse'
                      },
                  ]
              }





              $scope.isOpenLeft = function(){
                  return $mdSidenav('left').isOpen();
              };
              function debounce(func, wait, context) {
                  var timer;

                  return function debounced() {
                      var context = $scope,
                          args = Array.prototype.slice.call(arguments);
                      $timeout.cancel(timer);
                      timer = $timeout(function() {
                          timer = undefined;
                          func.apply(context, args);
                      }, wait || 10);
                  };
              }
              function buildDelayedToggler(navID) {
                  return debounce(function() {
                      // Component lookup should always be available since we are not using `ng-if`
                      $mdSidenav(navID)
                          .toggle()
                          .then(function () {
                              $log.debug("toggle " + navID + " is done");
                          });
                  }, 200);
              }
              function buildToggler(navID) {
                  return function() {
                      // Component lookup should always be available since we are not using `ng-if`
                      $mdSidenav(navID)
                          .toggle()
                          .then(function () {
                              $log.debug("toggle " + navID + " is done");
                          });
                  };
              }

              function signOut(){
                  $cookies.remove("usedata");
                  $state.go('login');
              }
      })
      .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
          $scope.close = function () {
              // Component lookup should always be available since we are not using `ng-if`
              $mdSidenav('left').close()
                  .then(function () {
                      $log.debug("close LEFT is done");
                  });
          };
      });
})();
