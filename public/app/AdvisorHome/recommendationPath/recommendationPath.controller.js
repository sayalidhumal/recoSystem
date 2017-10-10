/**
 * Created by Sanjay Karrolla on 10/6/2017.
 */
/**
 * Created by Sanjay Karrolla on 10/6/2017.
 */
/**
 * Created by Sanjay Karrolla on 9/24/2017.
 */
/**
 * Created by sayalidhumal on 8/13/17.
 */

(function () {
    angular.module('AdvisorHome').controller('recommendationPathController',recommendationPathController);

    recommendationPathController.$inject = ['UserService','$stateParams','_','CourseService','$stateParams','$filter','appconfig'];

    function recommendationPathController(UserService,$stateParams,_,CourseService,$stateParams,$filter,appconfig) {
        var vm=this;
        vm.coyote_id = $stateParams.coyote_id;
        vm.currentYear = appconfig.CurrentYear;
        vm.currentMonth = $filter('date')(new Date(), 'MMMM');
        vm.currentQuarter = appconfig.QUARTERS[vm.currentMonth];
        vm.quarterOrder = appconfig.QuarterOrder;
        vm.userDetails ={};
        vm.coursesData ={};
        vm.userCourse = [];
        vm.recommendationPath= {};
        vm.optionalSubjects=[];
        vm.optionalSchedule ={};
        vm.electiveCount = 0;
        vm.added = 0;

        /*vm.coursesRecommended = [
         {
         courseID:602,
         courseName:"Automata theory",
         totalUnits: 4

         },
         {
         courseID:655,
         courseName:"Software Engineering",
         totalUnits: 4
         }
         ];*/

        UserService.getRecommendationDetails(vm.coyote_id).then(
            function success(response) {
                console.log("",response.data);
                vm.userDetails = response.data;

                CourseService.getAllCourses(vm.currentYear).then(
                    function success(reponse) {
                        //console.log(reponse.data)
                        vm.coursesData = reponse.data;

                        /****  Grouping the courses and schedule  ***/
                        vm.schedule = _.groupBy(vm.coursesData.schedule,'course_id');

                        for(var i=0;i<vm.coursesData.core.length;i++){
                            vm.coursesData.core[i].schedule = vm.schedule[vm.coursesData.core[i].course_id];
                            for(var j=0;j<vm.coursesData.core[i].schedule.length;j++){
                                vm.coursesData.core[i].schedule[j].name = vm.coursesData.core[i].name
                                vm.coursesData.core[i].schedule[j].units = vm.coursesData.core[i].units
                            }

                        }

                        for(var i=0;i<vm.coursesData.electives.length;i++){
                            vm.coursesData.electives[i].schedule = vm.schedule[vm.coursesData.electives[i].course_id];
                            if(vm.coursesData.electives[i].schedule)
                                for(var j=0;j<vm.coursesData.electives[i].schedule.length;j++){
                                    vm.coursesData.electives[i].schedule[j].name = vm.coursesData.electives[i].name
                                    vm.coursesData.electives[i].schedule[j].units = vm.coursesData.electives[i].units
                                }
                        }
                        for(var i=0;i<vm.coursesData.prerequisites.length;i++){
                            vm.coursesData.prerequisites[i].schedule = vm.schedule[vm.coursesData.prerequisites[i].prerequisite_id];
                            for(var j=0;j<vm.coursesData.prerequisites[i].schedule.length;j++){
                                vm.coursesData.prerequisites[i].schedule[j].name = vm.coursesData.prerequisites[i].name
                                vm.coursesData.prerequisites[i].schedule[j].units = vm.coursesData.prerequisites[i].units
                            }
                        }

                        prerequisites(vm.userDetails,vm.coursesData.core,vm.coursesData.prerequisites);

                        core(vm.userDetails,vm.coursesData.core,vm.coursesData.prerequisites)

                        elective(vm.userDetails,vm.coursesData.electives,vm.coursesData.constraints)

                        vm.recommendationPath = formatForDisplay(vm.recommendationPath);

                        console.log(vm.recommendationPath)

                    },function error(response) {

                    }
                )
            },
            function error(response) {

            });


        function prerequisites(userDetails,coreCourses,coursePrerequisites) {

            var userPrerequistes = userDetails.prerequisites;
            var coursesTaken = userDetails.coursesTaken;
            var prerequisitesNotTaken=[];
            var coreNotTaken =[];
            var prerequisitesSchedule =[];

            // check if pre-requisites not taken
            for(var i=0;i<userPrerequistes.length;i++){
                if(_.indexOf(coursesTaken,userPrerequistes[i]) == -1){
                    prerequisitesNotTaken.push(userPrerequistes[i]);
                }
            }
            //get the respective core subjects
            if(prerequisitesNotTaken.length){
                for(var i=0;i<prerequisitesNotTaken.length;i++){
                    var obj = _.where(coursePrerequisites,{prerequisite_id: prerequisitesNotTaken[i]})[0];
                    if(prerequisitesNotTaken[i]!=306){
                        if(_.indexOf(coursesTaken,obj.course_id)== -1){
                            var object = _.where(coreCourses,{course_id:obj.course_id})[0];
                            object.prerequisite = prerequisitesNotTaken[i];
                            coreNotTaken.push(object);
                            prerequisitesSchedule.push(obj)
                        }
                        else {
                            prerequisitesNotTaken = _.without(prerequisitesNotTaken,prerequisitesNotTaken[i]);
                            i--;
                        }
                    }else {
                        // prerequisitesSchedule.push(obj);
                    }
                }
            }else {
                console.log("no prerequisites to be taken")
                return;
            }
            for(var i=0;i<coreNotTaken.length;i++){
                coreNotTaken[i].schedule = _.groupBy(coreNotTaken[i].schedule,'year');
            }

            var count = 0;
            var addPrereqschedule =[];
            var addCoreSchedule = [];

            if(prerequisitesNotTaken.length){
                //get the first quarter where prereq can be taken
                for(var k=0;k<coreNotTaken.length;k++){
                    var startcore = 1;
                    var flag = 0;
                    var startprereq = 1;
                    var year = vm.currentYear;
                    var p ={};
                    addPrereqschedule[count] = [];
                    addCoreSchedule[count] = [];

                    angular.forEach(coreNotTaken[k].schedule,function(schedule,year){

                        var a = [];
                        if(flag==0){
                            var i=0;
                            var p = [];
                            if(startcore==1){
                                i = _.indexOf(vm.quarterOrder,vm.currentQuarter)
                                startcore = 0;
                            }

                            for(;i<vm.quarterOrder.length;i++){
                                a = _.where(schedule,{quarter : vm.quarterOrder[i]});
                                if(a.length!=0){
                                    a = a[0];
                                    ///get the prerequisite first taken
                                    var prereq = _.where(prerequisitesSchedule,{course_id: a.course_id})[0];
                                    var string = a.quarter + a.year;
                                    var j=0;
                                    var preyear = vm.currentYear;
                                    if(startprereq==1){
                                        j = _.indexOf(vm.quarterOrder,vm.currentQuarter)
                                        startprereq = 0;
                                    }
                                    for(;j<vm.quarterOrder.length;j++){
                                        if(vm.quarterOrder[j]== "Winter" && vm.currentQuarter == "Fall"){
                                            preyear = preyear + 1;
                                        }
                                        var p = _.where(prereq.schedule,{quarter:vm.quarterOrder[j]})

                                        for(var l=0;l<p.length;l++){

                                            if(preyear==p[l].year && (p[l].quarter+p[l].year)!=string && preyear <=year){
                                                p[l]["type"] = "prerequisites"
                                                addPrereqschedule[count].push(p[l])
                                                a["type"] = "core"
                                                addCoreSchedule[count].push(a)
                                                flag=1;
                                            }
                                        }
                                    }
                                }
                            }
                            //console.log("plength",addschedule.length)
                            if(addPrereqschedule[count].length==0){
                                flag =0;
                            }
                            else{
                                count++;
                            }
                        }
                    })
                    if(addPrereqschedule[addPrereqschedule.length-1].length==0){
                        //forcefully add lastest schedule of prerequisite
                    }
                }
                addToPath(addPrereqschedule,vm.userDetails.preferences.other.course_count_preference,"prerequisite");
                addToPath(addCoreSchedule,vm.userDetails.preferences.other.course_count_preference,"core");
                return
            }
            else {
                console.log("no prerequisites to be taken")
                return;
            }

        }

        function core(userDetails,coreCourses,coursePrerequisites){
            var coreToBeAdded = [];
            var searchvalue;
            var index = -1
            //console.log(userDetails.prerequisites)
            for(var i = 0;i<userDetails.prerequisites.length;i++){
                if(userDetails.prerequisites[i] != 306){
                    searchvalue = _.where(coursePrerequisites,{prerequisite_id:userDetails.prerequisites[i]})[0].course_id;
                    index = _.findLastIndex(coreCourses,{course_id:searchvalue});
                    coreCourses.splice(index,1);
                }
            }

            for(var i=0;i<userDetails.coursesTaken.length;i++){
                index = _.findLastIndex(coreCourses,{course_id:userDetails.coursesTaken[i]});
                if(index!=-1)
                    coreCourses.splice(index,1);
            }

            for(var i=0;i<coreCourses.length;i++){
                coreToBeAdded[i] = [];
                for(var j=0;j<coreCourses[i].schedule.length;j++){
                    coreToBeAdded[i].push(coreCourses[i].schedule[j])
                }
            }

            for(var i=0;i<coreCourses.length;i++){
                coreCourses[i].schedule = _.groupBy(coreCourses[i].schedule,'year');
            }

            if(coreToBeAdded.length!=0)
                addToPath(coreToBeAdded,userDetails.preferences.other.course_count_preference,"core");

        }

        function elective(userDetails,electives,constraints) {

            var electivesToBeTaken = [];
            var index = -1;
            for(var i=0;i<constraints.length;i++){
                index = _.findLastIndex(electives,{course_id:constraints[i].constraint_id});
                electives.splice(index,1);
            }

            for(var i=0;i<electives.length;i++){
                if(electives[i].schedule){
                    if(electives[i].schedule[0].course_start_time == null){
                        index = _.findLastIndex(electives,{course_id:electives[i].course_id});
                        electives.splice(index,1);
                        i--;
                    }
                } else {
                    index = _.findLastIndex(electives,{course_id:electives[i].course_id});
                    electives.splice(index,1);
                    i--;
                }

            }
            var degreeRequirement = appconfig.DegreeRequirements;
            var electiveUnits = _.findWhere(degreeRequirement,{"degreeType":userDetails.preferences.other.degree_preference}).electiveUnits
            var electiveNo = electiveUnits/4
            console.log(electiveNo)
            var electiveCount = electiveUnits/4;
            electivesToBeTaken = getElectives(electives,vm.recommendationPath);
            var sortDay = sortByDay(electivesToBeTaken,vm.userDetails.preferences)

            var above =[];
            var below = [];
            for(var i=0;i<sortDay.length;i++){
                if(sortDay[i][0].course_id >600)
                    above.push(sortDay[i]);
                else
                    below.push(sortDay[i]);
            }

            if(above.length <= electiveNo){
                var sortTime = sortByTime(below,vm.userDetails.preferences);
            }



            if(userDetails.preferences.other.independent_study_preference){
                electiveNo--;
                electiveCount = electiveCount-1;
            }

            var data =[];
            data[0] = [];
            for(var i=0;i<above.length;i++){
                if(electiveCount>0){
                    data[0] = above[i]
                    addToPath(data,userDetails.preferences.other.course_count_preference,"elective");
                    if(vm.added==1){
                        vm.added=0;
                        electiveCount--;
                    }
                }

            }
            if(electiveCount>0){
                for(var i=0;i<below.length;i++){
                    if(electiveCount>0){
                        data[0] = below[i]
                        addToPath(data,userDetails.preferences.other.course_count_preference,"elective");
                        if(vm.added==1){
                            vm.added=0;
                            electiveCount--;
                        }
                    }

                }
            }

            if(electiveNo!=(electiveUnits/4)){
                console.log("add independent study")
            }
            return;
        }

        function getElectives(electives,path){
            var electivesToBeTaken = [];
            var keys = _.keys(path)
            var endingYear = keys[keys.length -1];
            keys = _.keys(path[endingYear]);
            var endingindex ;
            var endingQuarter;
            var count = 0;
            for(var i=0;i<vm.quarterOrder.length;i++){
                if(_.contains(keys,vm.quarterOrder[i])){
                    endingindex = i;
                    endingQuarter = vm.quarterOrder[i]
                }
            }
            var flag = 0;
            for(var i=0;i<electives.length;i++){
                electivesToBeTaken[count] = [];
                for(var j=0;j<electives[i].schedule.length;j++){
                    flag = 0
                    var a = electives[i].schedule[j];
                    if(path[a.year]){
                        if(path[a.year][a.quarter]){
                            var b = path[a.year][a.quarter];
                            for(var k =0;k<b.length;k++){
                                if(a.course_day == b[k].course_day) {
                                    if(a.lab_day && b[k].lab_day) {
                                        if (a.course_start_time > b[k].course_start_time) {
                                            if (b[k].lab_end_time < a.course_start_time)
                                                flag++;
                                        }else {
                                            if (a.lab_end_time < b[k].course_start_time) {
                                                flag++;
                                            }
                                        }
                                    }else{
                                        if(a.lab_day){
                                            if(a.course_start_time > b[k].course_start_time){
                                                if(b[k].course_end_time < a.course_start_time)
                                                    flag++;
                                            }else {
                                                if(a.lab_end_time < b[k].course_start_time){
                                                    flag++;
                                                }
                                            }
                                        }else{
                                            if(a.course_start_time > b[k].course_start_time){
                                                if(b[k].lab_end_time < a.course_start_time)
                                                    flag++;
                                            }else {
                                                if(a.course_end_time < b[k].course_start_time){
                                                    flag++;
                                                }
                                            }
                                        }
                                    }
                                }else
                                    flag ++;

                            }
                            if(flag == b.length){
                                electivesToBeTaken[count].push(a)
                            }
                        }else {
                            if(_.indexOf(vm.quarterOrder,a.quarter)< endingindex){
                                electivesToBeTaken[count].push(a)
                            }
                        }
                    }
                }
                if(electivesToBeTaken[count].length)
                    count++;
                else
                    electivesToBeTaken.splice(electivesToBeTaken.length-1,1)
            }
            return electivesToBeTaken
        }

        function sortByDay(electives,preference){
            var courses = [];
            var count = 0;

            if(preference.dayPreference.length<3){
                switch(preference.dayPreference.length){
                    case 1:
                        for(var i=0;i<electives.length;i++){
                            courses[count] = [];
                            for(var j=0;j<electives[i].length;j++){

                                if(electives[i][j].course_day ==preference.dayPreference[0]){
                                    courses[count].push(electives[i][j])
                                }
                            }
                            if(courses[count].length)
                                count++
                            else
                                courses.splice(courses.length-1,1);

                        }
                        return courses
                        break;
                    case 2:
                        for(var i=0;i<electives.length;i++){
                            courses[count] = [];
                            for(var j=0;j<electives[i].length;j++){
                                if(electives[i][j].course_day ==preference.dayPreference[0] || electives[i][j].course_day ==preference.dayPreference[1]){
                                    courses[count].push(electives[i][j])
                                }
                            }
                            if(courses[count].length)
                                count++
                            else
                                courses.splice(courses.length-1,1);

                        }
                        return courses
                        break;
                }
            }
            else
                return electives
        }

        function sortByTime(electives,preference) {
            if(preference.timePreference.length<3){
                var time=[];
                var sortTime =[];
                for(var i=0;i<preference.timePreference.length;i++){
                    switch (preference.timePreference[i]){
                        case "Morning":
                            time.push({start:'08:00:00-07',end:'12:00:00-07'})
                            break;
                        case "Afternoon":
                            time.push({start:'12:00:00-07',end:'17:00:00-07'})
                            break;
                        case "Evening":
                            time.push({start:'17:00:00-07',end:'22:00:00-07'})
                            break;
                    }
                }
                var count =0;
                for(var i=0;i<electives.length;i++){
                    sortTime[count]=[]
                    for(var j=0;j<electives[i].length;j++){
                        if((time[0].start<=electives[i][j].course_start_time && electives[i][j].course_end_time<=time[0].end) || (time[1].start<=electives[i][j].course_start_time && electives[i][j].course_end_time<=time[1].end)){
                            sortTime[count].push(electives[i][j])
                        }
                    }
                    if(sortTime[count].length!=0){
                        count++
                    }
                }
                if(sortTime[count].length==0){
                    sortTime.splice(count,1)
                }
                console.log("sorttime",sortTime)
                return sortTime
            }else
                return electives
        }

        function addToPath(courses,course_count_preference,courseType) {
            //console.log("add to path",courses)
            var currentQuarter = vm.currentQuarter;
            var year = vm.currentYear;
            var quarterOrder = vm.quarterOrder;
            var flag = 0;


            for(var i=0;i<courses.length;i++){
                for(var j=0;j<courses[i].length;j++){
                    flag = 0;
                    if(Object.keys(vm.recommendationPath).length == 0){
                        //console.log("adding",courses[i][j])
                        vm.recommendationPath[courses[i][j].year] = {};
                        vm.recommendationPath[courses[i][j].year][courses[i][j].quarter] = []
                        vm.recommendationPath[courses[i][j].year][courses[i][j].quarter].push(courses[i][j]);
                        vm.added = 1;
                        flag = 1;
                        if(courses[i].length > 1)
                            addOptional(courses[i],j+1)
                        break;
                    }

                    //check for year if present
                    if(vm.recommendationPath[courses[i][j].year]){
                        //check for quarter if present
                        if(vm.recommendationPath[courses[i][j].year][courses[i][j].quarter]){
                            if(vm.recommendationPath[courses[i][j].year][courses[i][j].quarter].length >= course_count_preference)
                                continue;

                            if(clashesCheck(vm.recommendationPath[courses[i][j].year][courses[i][j].quarter],courses[i][j],courseType)){
                                //console.log("adding11",courses[i][j])
                                vm.recommendationPath[courses[i][j].year][courses[i][j].quarter].push(courses[i][j]);
                                vm.added = 1;
                                flag = 1;
                                if(courses[i].length > 1)
                                    addOptional(courses[i],j+1)
                                break;
                            }else {
                                flag = 1;
                                if(courses[i].length > 1)
                                    addOptional(courses[i],j+1)
                                break;
                            }
                        }
                        else {
                            //console.log("adding",courses[i][j])
                            vm.recommendationPath[courses[i][j].year][courses[i][j].quarter] = []
                            vm.recommendationPath[courses[i][j].year][courses[i][j].quarter].push(courses[i][j]);
                            vm.added = 1;
                            flag = 1;
                            if(courses[i].length > 1)
                                addOptional(courses[i],j+1)
                            break;
                        }

                    }else {
                        //console.log("adding",courses[i][j])
                        vm.recommendationPath[courses[i][j].year] = {};
                        vm.recommendationPath[courses[i][j].year][courses[i][j].quarter] = []
                        vm.recommendationPath[courses[i][j].year][courses[i][j].quarter].push(courses[i][j]);
                        vm.added = 1;
                        flag = 1;
                        if(courses[i].length > 1)
                            addOptional(courses[i],j+1)
                        break;
                    }
                }
                if(flag == 0){
                    for(var j=0;j<courses[i].length;j++){
                        if(vm.recommendationPath[courses[i][j].year][courses[i][j].quarter].length < 4){
                            if(clashesCheck(vm.recommendationPath[courses[i][j].year][courses[i][j].quarter],courses[i][j],courseType)){
                                //console.log("adding",courses[i][j])
                                vm.recommendationPath[courses[i][j].year][courses[i][j].quarter].push(courses[i][j]);
                                vm.added = 1;
                                if(courses[i].length > 1)
                                    addOptional(courses[i],j+1)
                                break;
                            }
                            else {
                                flag = 1;
                                if(courses[i].length > 1)
                                    addOptional(courses[i],j+1)
                                break;
                            }
                        }
                    }
                }
            }

            function addOptional(courses,j) {
                vm.optionalSchedule[courses[0].course_id] = []
                for(;j<courses.length;j++)
                    vm.optionalSchedule[courses[j].course_id].push(courses[j])

                return
            }

            return
        }

        function clashesCheck(path,course,courseType) {
            var a = path;
            var flag =0;
            for(var k=0;k<a.length;k++){
                if(course.course_day == a[k].course_day){
                    //both have lab
                    if(course.lab_day && a[k].lab_day){
                        if(course.course_start_time > a[k].course_start_time){
                            if(a[k].lab_end_time < course.course_start_time)
                                flag++;
                            else{
                                clash(courseType,a[k],course)
                                flag--;
                                //console.log("clashes")
                            }
                        }else {
                            if(course.lab_end_time < a[k].course_start_time){
                                flag++;
                            }else{
                                clash(courseType,a[k],course)
                                flag--;
                                //console.log("clash 1",course,a[k])
                            }

                        }
                    }else {
                        //course to be added has lab
                        if(course.lab_day){
                            if(course.course_start_time > a[k].course_start_time){
                                if(a[k].course_end_time < course.course_start_time)
                                    flag++;
                                else{
                                    clash(courseType,a[k],course)
                                    flag--;
                                    //console.log("clash 2",course,a[k])
                                }
                            }else {
                                if(course.lab_end_time < a[k].course_start_time){
                                    flag++;
                                }else{
                                    clash(courseType,a[k],course)
                                    flag--;
                                    //console.log("clash 3",course,a[k])
                                }
                            }
                        }else {
                            //course in the recommendation path has lab
                            if(course.course_start_time > a[k].course_start_time){
                                if(a[k].lab_end_time < course.course_start_time)
                                    flag++;
                                else{
                                    //console.log("clash 4",course,a[k])
                                    clash(courseType,a[k],course)
                                    flag--;
                                }
                            }else {
                                if(course.course_end_time < a[k].course_start_time){
                                    flag++;
                                } else{
                                    clash(courseType,a[k],course)
                                    flag--;
                                    //console.log("clash 5",course,a[k])
                                }
                            }
                        }
                    }
                }else {
                    flag ++;
                }
            }
            if(flag == a.length){
                return true
            }
            else
                return false
        }

        function clash(courseType,pathcourse,course) {
            //console.log(courseType,"course in path",pathcourse,"course to be added",course)
            switch (courseType) {
                case "prerequisite":
                    // clash of prerequsities
                    break;
                case "core":
                    if(!vm.optionalSchedule[pathcourse.course_id]){
                        var coreSchedule = _.where(vm.coursesData.core,{course_id: course.course_id})[0].schedule;
                        var a = [];
                        a[0] = []
                        angular.forEach(coreSchedule,function (schedule,year) {

                            for(var j=0;j<schedule.length;j++){
                                if((schedule[j].year != course.year)||(schedule[j].quarter != course.quarter)){
                                    a[0].push(schedule[j])
                                    //console.log(schedule,year,a)
                                }
                            }
                        })
                        if(a[0].length){
                            addToPath(a,vm.userDetails.preferences.other.course_count_preference,"core");
                            break;
                        }

                    }else {

                    }

                    break;
                case "elective":

                    break;
            }

            return;
        }

        function formatForDisplay(path) {
            var recommendationPath = []
            angular.forEach(path,function (data,year) {
                var yearobj = {
                    year : year,
                    quarters: []
                }

                angular.forEach(data,function (schedules,quarter) {
                    var quarterObj = {
                        quarter: quarter,
                        schedule: []
                    }
                    quarterObj.schedule = schedules;
                    yearobj.quarters.push(quarterObj);
                })
                recommendationPath.push(yearobj)
            })

            return recommendationPath;
        }

    }
})();