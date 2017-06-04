(function(){
  angular.module('myApp').controller('toDoController',
  function(){
    var vm = this;
    vm.todoList = [
      {
        name: "first item",
        statue: "completed",
        priority: 'high'
      },
      {
        name: "second item",
        statue: "completed",
        priority: 'normal'
      }
      {
        name: "third item",
        statue: "incomplete",
        priority: 'low'
      }
      {
        name: "fourth item",
        statue: "incomplete",
        priority: 'high'
      }
    ];
  })
})();
