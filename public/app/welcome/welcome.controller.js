/**
 * Created by sayalidhumal on 8/3/17.
 */

(function(){
    angular.module('myApp').controller('WelcomeController',WelcomeController);

    WelcomeController.$inject=[];

    function WelcomeController(){
        var vm =this;
        vm.title = "Welcome to CSE MSCS Course Recommendation System"
        vm.welcomeNote = "This system will help you in planning what courses to take when to successfully graduate on time.";
    }
})();

