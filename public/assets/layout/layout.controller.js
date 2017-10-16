(function(){
  angular.module('myApp')
      .controller('LayoutController',
          function(appconfig,AuthService,$state,$scope,$mdSidenav,$log,$stateParams,$rootElement){
              var vm = this;
              vm.user = appconfig.CurrentUser;
              vm.signOut = signOut;
              $scope.toggleLeft = buildToggler('left');
              $rootElement.menu = []
              vm.menu = $rootElement.menu

              if($stateParams.userRole == 'advisor'){
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
                AuthService.logoutUser().then(function(){
                  console.log("successfully logged out");
                  $state.go('login');
                })
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
