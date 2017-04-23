(function(){

  angular.module('myApp').controller('Applications',  function(){
      var vm = this;
      var num = [2,3,4,5,6,7];
      vm.application = [
        {
          Name:'To Do',
          State: '',
          Description:'Add and delete items from the list',
          isAvaliable:true
        },
        {
          Name:'Coming soon',
          State:'',
          Description:'Add and delete items from the list',
          isAvaliable:false
        }
      ]
    })

})();
