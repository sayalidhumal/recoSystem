/**
 * Created by sayalidhumal on 6/4/17.
 */
(function () {
    angular.module("Studenthome").controller("RecommendationPathController",RecommendationPathController);

    RecommendationPathController.$inject = ["UserService","$stateParams","_","appconfig","CourseService","$filter"];

    function RecommendationPathController(UserService,$stateParams,_,appconfig,CourseService,$filter) {
        var vm=this;
        vm.coyote_id = $stateParams.userID;
        vm.currentYear = appconfig.CurrentYear;
        vm.currentMonth = $filter('date')(new Date(), 'MMMM');
        vm.currentQuarter = appconfig.QUARTERS[vm.currentMonth];
        vm.quarterOrder = appconfig.QuarterOrder;
        vm.userDetails ={};
        vm.coursesData ={};
        vm.userCourse = [];
        vm.recommendationPath= {};
        vm.optionalSubjects=[];
        vm.optionalSchedule ={}

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
                //console.log(response.data)
                vm.userDetails = response.data;
                console.log("userDetails",vm.userDetails);
                CourseService.getAllCourses(vm.currentYear).then(
                    function success(reponse) {
                        //console.log(reponse.data)
                        vm.coursesData = reponse.data;

                        /****  Grouping the courses and schedule  ***/
                        vm.schedule = _.groupBy(vm.coursesData.schedule,'course_id');

                        for(var i=0;i<vm.coursesData.core.length;i++){
                            vm.coursesData.core[i].schedule = vm.schedule[vm.coursesData.core[i].course_id];
                        }
                        for(var i=0;i<vm.coursesData.electives.length;i++){
                            vm.coursesData.electives[i].schedule = vm.schedule[vm.coursesData.electives[i].course_id];
                        }
                        for(var i=0;i<vm.coursesData.prerequisites.length;i++){
                            vm.coursesData.prerequisites[i].schedule = vm.schedule[vm.coursesData.prerequisites[i].prerequisite_id];
                        }


                        /** Adding pre-requisites **/
                        prerequisites(vm.userDetails,vm.coursesData.core,vm.coursesData.prerequisites);




                        //delete vm.coursesData.schedule;


                        /*** Filter the subjects according to the user preference ***/
                        //vm.ElectivescourseByDay= sortByDay(vm.userDetails,vm.coursesData);

                       // vm.ElectivecourseByTime = sortByTime(vm.userDetails,vm.coursesData);
                       // console.log(_.pluck(vm.ElectivescourseByDay,'course_id'),_.pluck(vm.ElectivecourseByTime,'course_id'));

                       // vm.common = _.union(_.pluck(vm.ElectivescourseByDay,'course_id'),_.pluck(vm.ElectivecourseByTime,'course_id'))

                       // console.log(vm.common)

                        /*** Get independent study if User wants to take it ***/
                       /* if(vm.userDetails.preferences.other.independent_study_preference){
                            vm.userCourse.push(_.where(vm.coursesData.electives,{name:'GRAD INDEPENDENT STUDY'}).course_id);

                        }*/



                    },function error(response) {

                }
                )
            },
            function error(response) {

        });


        /*Pre-requisites
         * Select the schedule for the prerequisites
         * Name: prerequisites()
         * Parameters: JSON objects
         *          userDetails: contains the course details of the student
         *          coreCourses: contains the list of core subjects
         *          coursePrerequisites: prerequisites of the core courses
         * Description: Select the best quarter to take the prerequisites
         */
        function prerequisites(userDetails,coreCourses,coursePrerequisites) {
            /*
            * STEPS:
            * Has the user taken pre-requisites
            * get the core and pre-requisites not taken by the user
            * are the pre-requisites add to the path
            * get the pre-requisites for the quarter
            * are the quarter pre-requisites added to the path
            * if no add
            * */
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

            var count =0;
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
                                                addPrereqschedule[count].push(p[l])
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
            }
            else {
                console.log("no prerequisites to be taken")
                return;
            }

        }

        function sortByDay(userDetails,coursesData) {

            var courseByDay=[];
            vm.degreeRequirement = appconfig.DegreeRequirements;
            vm.electiveUnits = _.findWhere(vm.degreeRequirement,{"degreeType":userDetails.preferences.other.degree_preference}).electiveUnits;

            if(userDetails.preferences.dayPreference.length<3){
                for(var i=0;i<userDetails.preferences.dayPreference.length;i++){
                    for(var j=0;j<coursesData.electives.length;j++){
                        var schedule = coursesData.electives[j].schedule;
                        if(schedule){
                            for(var k=0;k<schedule.length;k++){
                                if(schedule[k].course_day!='N/A'){
                                    if(userDetails.preferences.dayPreference[i].includes(schedule[k].course_day)){
                                        courseByDay.push(schedule[k]);
                                    }
                                }else {
                                    vm.optionalSubjects.push(schedule[k]);
                                }
                            }
                        }
                    }
                }

            }else{
                for(var j=0;j<coursesData.electives.length;j++){
                    var schedule = coursesData.electives[j].schedule;
                    if(schedule){
                        for(var k=0;k<schedule.length;k++){
                            if(schedule[k].course_day!='N/A')
                                courseByDay.push(schedule[k]);
                            else
                                vm.optionalSubjects.push(schedule[k]);
                        }
                    }
                }
            }

            return courseByDay;

        }

        function sortByTime(userDetails,coursesData,courseByDay) {
            var ElectivecourseByTime=[];
            if(userDetails.preferences.timePreference.length<3){
                for(var i=0;i<userDetails.preferences.timePreference.length;i++){
                    switch(userDetails.preferences.timePreference[i]){

                        case "Morning":
                            getSubjects("08:00:00-07","12:00:00-07");

                            break;
                        case "Afternoon":
                            getSubjects("12:00:00-07","17:00:00-07");

                            break;
                        case "Evening":
                            getSubjects("17:00:00-07","22:00:00-07");
                            break;
                    }
                }
                console.log(ElectivecourseByTime)
            }
            else{
                for(var j=0;j<coursesData.electives.length;j++){
                    var schedule = coursesData.electives[j].schedule;
                    if(schedule){
                        for(var k=0;k<schedule.length;k++){
                            if(schedule[k].course_start_time){
                                ElectivecourseByTime.push(schedule[k]);
                            }
                            else {
                                vm.optionalSubjects.push(schedule[k]);
                            }
                        }
                    }
                }
            }

            function getSubjects(start,end) {
                for(var j=0;j<coursesData.electives.length;j++){
                    var schedule = coursesData.electives[j].schedule;
                    if(schedule){
                        for(var k=0;k<schedule.length;k++){
                            if(schedule[k].course_start_time){
                                if(schedule[k].course_start_time >= start && schedule[k].course_end_time <= end){
                                    ElectivecourseByTime.push(schedule[k]);
                                }
                            }
                            else {
                                vm.optionalSubjects.push(schedule[k]);
                            }
                        }
                    }
                }

                return
            }

            return ElectivecourseByTime;
        }



        /*
        * Add course to the Recommendation Path
        * Name: addToPath()
        * Parameters: JSON object (containing courses to add and their schedule)
        * Description: Add the courses to the recommendation path
        */
        function addToPath(courses,course_count_preference,courseType) {
            console.log("cooouurree",courses)
            var currentQuarter = vm.currentQuarter;
            var year = vm.currentYear;
            var quarterOrder = vm.quarterOrder;
            var flag = 0;


            for(var i=0;i<courses.length;i++){
                for(var j=0;j<courses[i].length;j++){
                    flag = 0
                    if(Object.keys(vm.recommendationPath).length == 0){
                        vm.recommendationPath[courses[i][j].year] = {};
                        vm.recommendationPath[courses[i][j].year][courses[i][j].quarter] = []
                        vm.recommendationPath[courses[i][j].year][courses[i][j].quarter].push(courses[i][j]);
                        flag = 1;
                        if(courses[i].length > 1)
                            addOptional(courses[i],j+1)
                        break;
                    }

                    //check for year if present
                    if(vm.recommendationPath[courses[i][j].year]){
                        //check for quarter if present
                        if(vm.recommendationPath[courses[i][j].year][courses[i][j].quarter] ){
                            if(vm.recommendationPath[courses[i][j].year][courses[i][j].quarter].length >= course_count_preference)
                                continue;

                            if(clashesCheck(vm.recommendationPath[courses[i][j].year][courses[i][j].quarter],courses[i][j],courseType)){
                                vm.recommendationPath[courses[i][j].year][courses[i][j].quarter].push(courses[i][j]);
                                flag = 1;
                                if(courses[i].length > 1)
                                    addOptional(courses[i],j+1)
                                break;
                            }
                            //previous reco code will go here if this clashesCheck() does not work above if() will be removed
                        }
                        else {
                            vm.recommendationPath[courses[i][j].year][courses[i][j].quarter] = []
                            vm.recommendationPath[courses[i][j].year][courses[i][j].quarter].push(courses[i][j]);
                            flag = 1;
                            if(courses[i].length > 1)
                                addOptional(courses[i],j+1)
                            break;
                        }

                    }else {
                        vm.recommendationPath[courses[i][j].year] = {};
                        vm.recommendationPath[courses[i][j].year][courses[i][j].quarter] = []
                        vm.recommendationPath[courses[i][j].year][courses[i][j].quarter].push(courses[i][j]);
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
                                vm.recommendationPath[courses[i][j].year][courses[i][j].quarter].push(courses[i][j]);
                                if(courses[i].length > 1)
                                    addOptional(courses[i],j+1)
                                break;
                            }
                            //previous reco code will go here if this clashesCheck() does not work above if() will be removed
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
            console.log(vm.recommendationPath,vm.optionalSchedule)
            return
        }

        /*
         * Check for time clashes
         * Name: clashesCheck()
         * Parameters: JSON objects
         *              path: contains the recommendation path part clashes is to be checked
         *              course: course that is to be added
         * Description: Checks for course schedule time clashes
         */
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
                                console.log("clashes")
                            }
                        }else {
                            if(course.lab_end_time < a[k].course_start_time){
                                flag++;
                            }else{
                                clash(courseType,a[k],course)
                                console.log("clash 1",course,a[k])
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
                                    console.log("clash 2",course,a[k])
                                }
                            }else {
                                if(course.lab_end_time < a[k].course_start_time){
                                    flag++;
                                }else{
                                    clash(courseType,a[k],course)
                                    console.log("clash 3",course,a[k])
                                }
                            }
                        }else {
                            //course in the recommendation path has lab
                            if(course.course_start_time > a[k].course_start_time){
                                if(a[k].lab_end_time < course.course_start_time)
                                    flag++;
                                else{
                                    clash(courseType,a[k],course)
                                    console.log("clash 4",course,a[k])
                                }
                            }else {
                                if(course.course_end_time < a[k].course_start_time){
                                    flag++;
                                } else{
                                    clash(courseType,a[k],course)
                                    console.log("clash 5",course,a[k])
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
        }

        function clash(courseType,pathcourse,course) {
            console.log(vm.recommendationPath)
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
                                console.log("core in clash",schedule[j].year,course.year,schedule[j].quarter,course.quarter)
                                if((schedule[j].year != course.year)||(schedule[j].quarter != course.quarter)){
                                    a[0].push(schedule[j])
                                }
                            }
                        })
                        addToPath(a,vm.userDetails.preferences.other.course_count_preference,"core");
                    }else {
                        //switch to the other schedule
                    }

                    break;
                case "elective":

                    break;
            }
        }
    }


})();

// var a = vm.recommendationPath[courses[i][j].year][courses[i][j].quarter];
//
// for(var k=0;k<a.length;k++){
//     if(courses[i][j].course_day == a[k].course_day){
//         if(courses[i][j].lab_day && a[k].lab_day){
//             if((courses[i][j].course_start_time > a[k].course_start_time) && (a[k].lab_end_time < courses[i][j].course_start_time)){
//                 flag++;
//             }else {
//                 if(courses[i][j].lab_end_time < a[k].course_start_time){
//                     flag++;
//                 }
//             }
//         }else {
//             if(courses[i][j].lab_day){
//                 if((courses[i][j].course_start_time > a[k].course_start_time) && (a[k].course_end_time < courses[i][j].course_start_time)){
//                     flag++;
//                 }else {
//                     if(courses[i][j].lab_end_time < a[k].course_start_time){
//                         flag++;
//                     }
//                 }
//             }else {
//                 if((courses[i][j].course_start_time > a[k].course_start_time) && (a[k].lab_end_time < courses[i][j].course_start_time)){
//                     flag++;
//                 }else {
//                     if(courses[i][j].course_end_time < a[k].course_start_time){
//                         flag++;
//                     }
//                 }
//             }
//         }
//     }else {
//         flag ++;
//     }
// }
// if(flag == a.length){
//     vm.recommendationPath[courses[i][j].year][courses[i][j].quarter].push(courses[i][j]);
//     break;
// }