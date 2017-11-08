/**
 * Created by sayalidhumal on 10/19/17.
 */
(function () {
    angular.module('AdvisorHome').controller('EditPathController',EditPathController);

    EditPathController.$inject = ['$stateParams','$mdToast','$state','UserService','CourseService'];

    function EditPathController($stateParams,$mdToast,$state,UserService,CourseService) {
        var vm=this;
        vm.form ={};
        var path= $stateParams.path;
        vm.coyote_id = $stateParams.coyote_id;
        console.log($stateParams)
        vm.recommendationPath = path[0].path;
        vm.optionalSubjects = path[0].optionalElective;
        vm.subjectsInPath = [];
        vm.subjectToRemove = {};
        vm.subjectToAdd ={};
        vm.quartertoadd='';
        vm.obj = {
            clash: []
        }
        console.log(vm.optionalSubjects,vm.recommendationPath)

        vm.check = check;
        vm.add = add;
        for(var i=0;i<vm.recommendationPath.length;i++){
            for(var j=0;j<vm.recommendationPath[i].quarters.length;j++){
                for(var k=0;k<vm.recommendationPath[i].quarters[j].schedule.length;k++){
                    if(vm.recommendationPath[i].quarters[j].schedule[k].type === "elective"){
                        if(vm.recommendationPath[i].quarters[j].schedule[k].course_id !== "699" && vm.recommendationPath[i].quarters[j].schedule[k].course_id !== "689" && vm.recommendationPath[i].quarters[j].schedule[k].course_id !== "690"){
                            vm.subjectsInPath.push(vm.recommendationPath[i].quarters[j].schedule[k])
                            //console.log(vm.recommendationPath[i].quarters[j].schedule[k].course_id,vm.recommendationPath[i].quarters[j].schedule[k].course_id !== 699 && vm.recommendationPath[i].quarters[j].schedule[k].course_id !== 689 && vm.recommendationPath[i].quarters[j].schedule[k].course_id !== 690)
                        }
                    }
                }
            }
        }

        function add(subject) {
            vm.quarters = subject.quarters;
        }

        function check() {
            vm.quartertoadd= vm.quartertoadd.split(" ");
            var quarter = vm.quartertoadd[0];
            var year = vm.quartertoadd[1];
            var scheduleAdd = _.findWhere(vm.subjectToAdd.schedule,{quarter: quarter,year: year});
            var path = angular.copy(vm.recommendationPath);
            // First step to remove the course
            var a = _.findLastIndex(path,{year: vm.subjectToRemove.year});
            var b = _.findLastIndex(path[a].quarters,{quarter: vm.subjectToRemove.quarter});
            var c = _.findLastIndex(path[a].quarters[b].schedule,{course_id:vm.subjectToRemove.course_id});
            path[a].quarters[b].schedule.splice(c,1);

            if(path[a].quarters[b].schedule.length === 0){
                path[a].quarters.splice(b,1);
                if(path[a].quarters.length === 0){
                    path.splice(a,1);
                }
            }

            vm.obj = clashCheck(path,quarter,year,scheduleAdd);
            console.log(vm.obj)

            if(vm.obj.message){
                console.log("optional",vm.optionalSubjects)
                vm.recommendationPath = vm.obj.path;
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('course added')
                        .hideDelay(4000)
                );
                CourseService.getCourseWithSchedule(parseInt(vm.subjectToRemove.course_id)).then(
                    function success(response) {
                       var obj =response.data
                        obj[0].quarters = []
                        for(var j=0;j<obj[0].schedule.length;j++){
                            obj[0].schedule[j].name = obj[0].name;
                            obj[0].schedule[j].units = obj[0].units;
                            obj[0].schedule[j].type = "elective"
                            var results = _.contains(obj[0].quarters,obj[0].schedule[j].quarter + " " + obj[0].schedule[j].year)
                            if(!results){
                                obj[0].quarters.push(obj[0].schedule[j].quarter + " " + obj[0].schedule[j].year);
                            }
                        }
                        vm.subjectToRemove = {};
                        vm.subjectToAdd ={};
                        vm.quartertoadd='';
                        var index = _.findLastIndex(vm.optionalSubjects,{course_id:scheduleAdd.course_id});
                        if(index !== -1){
                            vm.optionalSubjects.splice(index,1);
                        }
                        vm.optionalSubjects.push(obj[0]);
                        console.log("llll",vm.optionalSubjects)
                        UserService.addRecommendationPath([{path:vm.recommendationPath,optionalElective: vm.optionalSubjects}],vm.coyote_id).then(
                            function success(response) {
                                console.log("Path Added Successfully")
                                $state.go('root.advisor.advisorhome.recommendationpath');
                            },
                            function error() {
                            })
                    },function error() {

                    })
            }
            else {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('clash')
                        .hideDelay(4000)
                );
                vm.subjectToRemove = {};
                vm.subjectToAdd ={};
                vm.quartertoadd='';
            }

            //var scheduleOBJ = path[yearOBJ].quarters[quarterOBJ].schedule;

        }

        function clashCheck(path,quarter,year,scheduleAdd) {
            var yearOBJ = _.findLastIndex(path,{year: year});
            var flag=0;
            var clash=[];
            var message = false;
            if(yearOBJ!==-1){
                var quarterOBJ = _.findLastIndex(path[yearOBJ].quarters,{quarter: quarter});
                if(quarterOBJ!==-1){
                    var b = path[yearOBJ].quarters[quarterOBJ].schedule;
                    for(var k=0;k<b.length;k++){
                        if(scheduleAdd.course_day === b[k].course_day) {
                            if(scheduleAdd.lab_day && b[k].lab_day) {
                                if (scheduleAdd.course_start_time > b[k].course_start_time) {
                                    if (b[k].lab_end_time < scheduleAdd.course_start_time)
                                        flag++;
                                    else
                                        clash.push({course_id: b[k].course_id,name: b[k].name})
                                }else {
                                    if (scheduleAdd.lab_end_time < b[k].course_start_time) {
                                        flag++;
                                    }else
                                        clash.push({course_id: b[k].course_id,name: b[k].name})
                                }
                            }else{
                                if(scheduleAdd.lab_day){
                                    if(scheduleAdd.course_start_time > b[k].course_start_time){
                                        if(b[k].course_end_time < scheduleAdd.course_start_time)
                                            flag++;
                                        else
                                            clash.push({course_id: b[k].course_id,name: b[k].name})
                                    }else {
                                        if(scheduleAdd.lab_end_time < b[k].course_start_time){
                                            flag++;
                                        }
                                        else
                                            clash.push({course_id: b[k].course_id,name: b[k].name})
                                    }
                                }else{
                                    if(scheduleAdd.course_start_time > b[k].course_start_time){
                                        if(b[k].lab_end_time < scheduleAdd.course_start_time)
                                            flag++;
                                        else
                                            clash.push({course_id: b[k].course_id,name: b[k].name})
                                    }else {
                                        if(scheduleAdd.course_end_time < b[k].course_start_time){
                                            flag++;
                                        }
                                        else
                                            clash.push({course_id: b[k].course_id,name: b[k].name})
                                    }
                                }
                            }
                        }else
                            flag ++;
                    }
                    if(flag === b.length){
                        path[yearOBJ].quarters[quarterOBJ].schedule.push(scheduleAdd);
                        message=true;
                    }
                }else{
                    path[yearOBJ].quarters.push({quarter:quarter,schedule:[scheduleAdd]})
                    message=true;
                }
            }else{
                path.push({year:year,quarters:[{quarter:quarter,schedule:[scheduleAdd]}]})
                message=true;
            }
            return {clash:clash,path:path,message:message};
        }
    }
})();
