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
                },

                createCourse: function (Course) {
                    return $http({
                        method: 'POST',
                        url: '/createCourses',
                        data: {course:Course}
                    })
                },

                updateCourse: function(schedule) {
                    return $http({
                        method: 'PUT',
                        url: '/updateCourse',
                        data: {schedule: schedule}
                    })
                },

                addSchedule: function (schedule) {
                    return $http({
                        method: 'POST',
                        url: '/addSchedule',
                        data: {schedule: schedule}
                    })
                },

                getCourseWithSchedule:function (courseID) {
                    return $http({
                        method: 'GET',
                        url:'/getCourseWithSchedule',
                        params: {courseID: courseID}
                    })
                },

                deleteCourseSchedule: function (course) {
                    return  $http({
                        method: 'DELETE',
                        url: '/deleteCourseSchedule',
                        params: {course: course}
                    })
                }

            }//end of outer return
        })
})();
