(function(){
  angular.module('Signup').controller('SignUpController',SignUpController).directive('checkStrength',checkStrength);

    SignUpController.$inject=['$state','AuthService','UserService','$scope'];

    function checkStrength() {
        return {
            replace: false,
            restrict: 'EACM',
            link: function (scope, iElement, iAttrs) {

                var strength = {
                    colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
                    mesureStrength: function (p) {

                        var _force = 0;
                        var _regex = /[$-/:-?{-~!"^_`\[\]]/g;

                        var _lowerLetters = /[a-z]+/.test(p);
                        var _upperLetters = /[A-Z]+/.test(p);
                        var _numbers = /[0-9]+/.test(p);
                        var _symbols = _regex.test(p);

                        var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];
                        var _passedMatches = $.grep(_flags, function (el) { return el === true; }).length;

                        _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
                        _force += _passedMatches * 10;

                        // penality (short password)
                        _force = (p.length <= 6) ? Math.min(_force, 10) : _force;

                        // penality (poor variety of characters)
                        _force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
                        _force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
                        _force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;

                        return _force;

                    },
                    getColor: function (s) {

                        var idx = 0;
                        if (s <= 10) { idx = 0; }
                        else if (s <= 20) { idx = 1; }
                        else if (s <= 30) { idx = 2; }
                        else if (s <= 40) { idx = 3; }
                        else { idx = 4; }

                        return { idx: idx + 1, col: this.colors[idx] };

                    }
                };

                scope.$watch(iAttrs.checkStrength, function () {
                    if (scope.password === '') {
                        iElement.css({ "display": "none"  });
                    } else {
                        var c = strength.getColor(strength.mesureStrength(scope.password));
                        iElement.css({ "display": "inline" });
                        iElement.children('li')
                            .css({ "background": "#DDD" })
                            .slice(0, c.idx)
                            .css({ "background": c.col });
                    }
                });

            },
            template: '<li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li>'
        };

    }



  function SignUpController($state,AuthService,UserService,$scope) {
      var vm = this;
      $scope.password = '';
      vm.myDate = new Date();
      vm.minDate = new Date(
          vm.myDate.getFullYear() - 100,
          vm.myDate.getMonth(),
          vm.myDate.getDate()
      );

      vm.maxDate = new Date(
          vm.myDate.getFullYear() - 10,
          vm.myDate.getMonth(),
          vm.myDate.getDate()
      );

      vm.states = ('AL AK AZ AR WY CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
      'CA').split(' ').map(function (state) {
          return {abbrev: state};
      });
      vm.form = {}
      vm.user = {
          'password': null,
          'role': 'student',
          'name': {
              "FirstName": null,
              "LastName": null,
              "MiddleName": null
          },
          "email": null,
          "phone": null,
          "userID": null,
          "address": {
              "Address": "",
              "City": "",
              "State": "",
              "Pin": ""
          },
          "dateOfBirth": ""
      }
      vm.create = create;
      vm.cancel = cancel;

      function create() {
          console.log(vm.user)
          AuthService.createUser(vm.user).then(function () {
                  console.log("user created successfully");
                  $state.go('root.student.questionnaire');
              },
              function (reason) {
                  console.log(reason);
              })
      }

      function cancel() {
          $state.go('login');
      }
  }
})();
