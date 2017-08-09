/**
 * Created by sayalidhumal on 8/3/17.
 */

(function(){
    angular.module('myApp').controller('WelcomeController',WelcomeController);

    WelcomeController.$inject=[];

    function WelcomeController(){
        var vm =this;
        vm.title = "Welcome to Course Recommendation System"
        vm.welcomeNote = "Welcome Note ";

    }
})();

