/**
 * Created by sayalidhumal on 9/6/17.
 */
angular.module('underscore', []).factory('_', ['$window', function($window) {
    return $window._; // assumes underscore has already been loaded on the page
}]);