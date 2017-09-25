(function(){
    angular.module('services').factory('CourseService',
        function($http){
            return{

                getCourse: function(courseID,courseName) {
                    return $http({
                        method: 'GET',
                        url: '/getCourse',
                        params:{courseID: courseID,courseName: courseName}
                    })
                },

                getCourseType: function (courseID) {
                    return $http({
                        method: 'GET',
                        url: '/getCourseType',
                        params:{courseID: courseID}
                    })
                },

                getCourseDetailsForYear: function (courseID,currentYear,nextYear) {
                    return $http({
                        method: 'GET',
                        url:'/getCourseDetailsForYear',
                        params:{courseID: courseID,currentYear: currentYear,nextYear: nextYear}
                    })
                },

                getAllCourses: function (currentYear) {
                    return $http({
                        method: 'GET',
                        url: '/getAllCourses',
                        params:{currentYear:currentYear}
                    })
                }

            }//end of outer return
        })
})();
