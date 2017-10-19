const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');

const loginQueries = require('../queries/login.queries');
const questionnaireQueries = require('../queries/questionnaire.queries');
const userQueries = require('../queries/user.queries');
const courseQueries = require('../queries/course.queries');

router.get('/', function(req, res, next){
    console.log(path.join(
        __dirname, '..','..','index.html'))
    res.sendFile(path.join(
    __dirname, '..','..','index.html'));
});

router.get('/login', loginQueries.getUser);

router.put('/changePassword',loginQueries.changePassword);

router.post('/createUser',loginQueries.createUser);

router.post('/addPreference',questionnaireQueries.addPreference);

router.get('/getPreference',questionnaireQueries.getPreference);

router.put('/updatePreference',questionnaireQueries.updatePreference);

router.get('/getEnrolledCourses',userQueries.getEnrolledCourses);

router.get('/getUserRole',userQueries.getUserRole);

router.get('/getCourse',courseQueries.getCourse);

router.get('/getCourseType',courseQueries.getCourseType);

router.get('/getCourseDetailsForYear',courseQueries.getCourseDetailsForYear);

router.get('/getRecommendationDetails',userQueries.getRecommendationDetails);

router.get('/getUser',userQueries.getUser);

router.get('/getAllCourses',courseQueries.getAllCourses);

router.post('/createCourses',courseQueries.createCourse);

router.post('/addPrerequisite',courseQueries.addPrerequisite);

router.put('/addRecommendationPath',userQueries.addRecommendationPath);

router.get('/viewPrerequisite',courseQueries.viewPrerequisite);

router.get('/getPrerequisite',courseQueries.getPrerequisite);

router.put('/updateUser',userQueries.updateUser);

router.put('/updateCourse',courseQueries.updateCourse);

router.post('/addSchedule',courseQueries.addSchedule);

router.post('/resetPassword',loginQueries.resetPassword);


module.exports = router;
