/**
 * Created by Sanjay Karrolla on 9/24/2017.
 */
/**
 * Created by sayalidhumal on 8/13/17.
 */

(function () {
    angular.module('AdvisorHome').controller('addPrerequisitesController',addPrerequisitesController);

    addPrerequisitesController.$inject = ['CourseService','$state','PrerequisiteService','$stateParams','$mdToast','_'];

    function addPrerequisitesController(CourseService,$state,PrerequisiteService,$stateParams,$mdToast,_) {
        var vm =this;
        vm.form = {};
        vm.prerequisite = [];
        vm.coyote_id = $stateParams.coyote_id;
        vm.data = [];
        vm.add =add;
        vm.delete = deletePrereq;
        vm.courseidadd;
        vm.course;
        vm.addPrerequisite = {
            "coyote_id":"$stateParams.coyote_id",
            "course_id":"null"
        }


        PrerequisiteService.viewPrerequisite(vm.coyote_id).then(
            function success(response) {
                vm.prerequisite= response.data;
                console.log("Prerequisite",vm.prerequisite);
                PrerequisiteService.getPrerequisite().then(
                    function success(response) {
                        vm.course=response.data;
                        console.log(vm.course, "Success")
                        vm.course.push({prerequisite_id:"306",name:"Expository Writing for the Natural Sciences"})
                        var index;
                        for(var i=0;i<vm.prerequisite.length;i++){
                            index= _.findLastIndex(vm.course,{prerequisite_id:vm.prerequisite[i].course_id})
                            console.log("index",index)
                            if(index!=-1)
                                vm.course.splice(index,1);
                        }
                    }, function error(response) {
                        console.log(response);
                    });
            },function error(response) {
                console.log(response);
            });


        function add(id) {
            vm.addPrerequisite.course_id = id;
            vm.addPrerequisite.coyote_id = $stateParams.coyote_id;
            vm.data.push(vm.addPrerequisite);
            var index = _.findLastIndex(vm.course,{prerequisite_id:id})
            vm.prerequisite.push({course_id:vm.course[index].prerequisite_id,name:vm.course[index].name});
            vm.course.splice(index,1);
            PrerequisiteService.postprerequisite(vm.data[0]).then(
                function success(response) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Prerequisite Added')
                            .hideDelay(4000)
                    );
                    //$state.go('root.advisor.advisorhome.addprerequisites');
                   //$state.go($state.current, {}, {reload: true});
                },function error(response) {
                    console.log(response);
                });


        }

        function deletePrereq(course_id) {
            PrerequisiteService.deletePrerequisite(vm.coyote_id,course_id).then(function success() {
                $state.go($state.current, {}, {reload: true});
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Prerequisite Deleted')
                        .hideDelay(4000)
                );
            },function error() {

            })
        }
    }
})();