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
    angular.module('AdvisorHome').controller('educationalHistoryController',educationalHistoryController);

    educationalHistoryController.$inject = ['UserService','$state','PrerequisiteService','$stateParams','$mdToast'];

    function educationalHistoryController(UserService,$state,PrerequisiteService,$stateParams,$mdToast) {
        var vm = this;
        vm.coyote_id = $stateParams.coyote_id;
        console.log(vm.coyote_id,"ID");
        vm.gradePointAverage = 0;

        vm.userCourseDetails =[];
        //vm.gradePointAverageCalculate=gradePointAverageCalculate;

        UserService.getCoursesTaken(vm.coyote_id).then(function success(response) {
                vm.userCourseDetails = response.data;
                console.log("userDetails",vm.userCourseDetails)
                vm.coursesTaken=[];
                vm.coursesEnrolled=[];
                for(var i=0;i<vm.userCourseDetails.length;i++){
                    if(vm.userCourseDetails[i].grade!=null){
                        vm.coursesTaken.push(vm.userCourseDetails[i]);
                    }else {
                        vm.coursesEnrolled.push(vm.userCourseDetails[i]);
                    }
                }
                console.log("courseTaken",vm.coursesTaken,vm.coursesEnrolled)
                vm.gradePointAverage = gradePointAverageCalculate(vm.coursesTaken);
                console.log(vm.gradePointAverage,"gradePointAverage")
            },
            function error(reason) {}
        )
        function gradePointAverageCalculate(userCourseDetails) {
            var gradeopts = {
                "A": 4,
                "A-": 3.7 ,
                "B+": 3.3,
                "B": 3,
                "B-": 2.7,
                "C+": 2.3,
                "C": 2,
                "C-": 1.7,
                "D+": 1.3,
                "D": 1,
                "D-": 0.7,
                "F": 0
            }
            var gradepoints = 0;
            var totalUnitstaken = 0;
            var gradePointAverage =0;
            for(var i=0;i<userCourseDetails.length;i++){
                if(userCourseDetails[i].grade){
                    gradepoints = gradepoints + (userCourseDetails[i].units*gradeopts[userCourseDetails[i].grade]);
                    totalUnitstaken = totalUnitstaken + userCourseDetails[i].units;
                }
            }
            if(gradepoints){
                gradePointAverage = gradepoints / totalUnitstaken;
            }

            return gradePointAverage;
        }

    }
})();