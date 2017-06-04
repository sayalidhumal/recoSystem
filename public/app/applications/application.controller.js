(function(){

  angular.module('myApp').controller('Applications',  function(){
      var vm = this;

      vm.application = [
        {
          Name:'To Do',
          State: "root.toDo",
          Description:'Add and delete items from the list',
          isAvaliable:true
        }
      ]
    })

})();
