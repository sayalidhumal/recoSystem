/**
 * Created by sayalidhumal on 7/23/17.
 */
(function () {
    const express = require('express');
    const router = express.Router();
    const pg = require('pg');
    const path = require('path');
    const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/recomSystem';

    function getUserRole(req, res, next) {
        var coyote_id = req.query.coyote_id;
        var results =[]

        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const student = client.query('SELECT * FROM student WHERE coyote_id =' + coyote_id + ';');
            const admin = client.query('SELECT * FROM administrator WHERE coyote_id =' + coyote_id + ';');
            const advisor = client.query('SELECT * FROM advisor WHERE coyote_id =' + coyote_id + ';');

            student.on('row', function(row){
                results.push(row);
            });
            student.on('end', function(){
                done();
                console.log(results)
                if(!results.length){
                    admin.on('row', function(row){
                        results.push(row);
                    });
                    admin.on('end', function(){
                        done();
                        if(!results.length){
                            console.log("advisor")
                            advisor.on('row', function(row){
                                results.push(row);
                            });
                            advisor.on('end', function(){
                                done();
                                results[0]="advisor"
                                return res.json(results);
                            });
                        }
                        else {
                            console.log("admin")
                            results[0]="administrator"
                            return res.json(results);
                        }
                    });

                }
                else {
                    console.log("student")
                    results[0]="student"
                    return res.json(results);
                }

            });


        });
    }


    function getEnrolledCourses(req, res, next){
        const userID = req.query.userID;
        var results = {
            coursesEnrolled: [],
            details:[]
        };
        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const coursesEnrolled = client.query('SELECT * FROM "coursesEnrolled" WHERE "userID" =' + userID + ';');

            const studentDetails = client.query('SELECT * FROM "studentDetails" WHERE "userID" =' + userID + ';');

            studentDetails.on('row', function(row){
                results.details.push(row);
            });

            studentDetails.on('end', function(){
                done();
                return res.json(results);
            });
            coursesEnrolled.on('row', function(row){
                results.coursesEnrolled.push(row);
            });

            coursesEnrolled.on('end', function(){
                done();
                //return res.json(results);
            });
        });
    }

    function getUser(req, res, next){
        var coyote_id = req.query.coyote_id;
        var name = req.query.name;
        //console.log(user_name)
        const results = [];

        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            if(coyote_id){
                const query = client.query("SELECT * FROM "+ '"user"' + "WHERE coyote_id = '" + coyote_id + "';");
                query.on('row', function(row){
                    //results.push({type:"elective"});
                    results.push(row);
                });
                query.on('end', function(){
                    done();
                    return res.json(results);
                });
            }else {
                name = name.toLowerCase();
                query =client.query("SELECT * FROM"+ '"user"'+ "WHERE lower(name)LIKE '%" + name + "%';");
                query.on('row', function(row){
                    console.log(row)
                    results.push(row);
                });
                query.on('end', function(){
                    done();
                    return res.json(results);
                });
            }

        });
    }

    function postUser(req, res, next){
        var coyote_id = req.query.coyote_id;
        var name = req.query.name;
        //console.log(user_name)
        const results = [];

        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            if(coyote_id){
                const query = client.query("SELECT * FROM "+ '"user"' + "WHERE coyote_id = '" + coyote_id + "';");
                query.on('row', function(row){
                    //results.push({type:"elective"});
                    results.push(row);
                });
                query.on('end', function(){
                    done();
                    return res.json(results);
                });
            }else {
                query =client.query("SELECT * FROM"+ '"user"'+ "WHERE name='" + name + "';");
                query.on('row', function(row){
                    console.log(row)
                    results.push(row);
                });
                query.on('end', function(){
                    done();
                    return res.json(results);
                });
            }

        });
    }





    function getRecommendationDetails(req, res, next) {
        const coyote_id = req.query.coyote_id;
        var results = {
            preferences:{
                dayPreference: [],
                timePreference:[],
                other:{}
            },
            coursesTaken: [],
            prerequisites:[],
            path: {}
        };
        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const coursestaken = client.query('SELECT course_id,day_time,grade,instructor,quarter_year FROM course_taken WHERE coyote_id =' + coyote_id + ';');

            const preference = client.query('SELECT degree_preference,course_count_preference,course_overload_preference,independent_study_preference,lecture_preference,summer_course_preference FROM student_preference WHERE coyote_id =' + coyote_id + ';');

            const prerequisites = client.query('SELECT course_id FROM student_prerequisite WHERE coyote_id =' + coyote_id + ';');

            const dayPreference = client.query('SELECT day_preference FROM day_preference WHERE coyote_id =' + coyote_id + ';');

            const timePreference = client.query('SELECT time_preference FROM time_preference WHERE coyote_id =' + coyote_id + ';');

            const path = client.query('SELECT current_recommendation_path FROM student WHERE coyote_id =' + coyote_id + ';')

            coursestaken.on('row', function(row){
                results.coursesTaken.push(row);
            });
            coursestaken.on('end', function(){
                done();
                //return res.json(results);
            });

            preference.on('row', function(row){
                results.preferences.other = row;
            });
            preference.on('end', function(){
                done();
                //return res.json(results);
            });

            prerequisites.on('row', function(row){
                results.prerequisites.push(row.course_id);
            });
            prerequisites.on('end', function(){
                done();
                //return res.json(results);
            });

            dayPreference.on('row', function(row){
                results.preferences.dayPreference.push(row.day_preference);
            });
            dayPreference.on('end', function(){
                done();
                //return res.json(results);
            });

            timePreference.on('row', function(row){
                results.preferences.timePreference.push(row.time_preference);
            });

            timePreference.on('end', function(){
                done();
                //return res.json(results);
            });

            path.on('row', function(row){

                results.path = row.current_recommendation_path;
            });

            path.on('end', function(){
                done();
                return res.json(results);
            });

        });
    }

    module.exports = {
        getEnrolledCourses: getEnrolledCourses,
        getUserRole:getUserRole,
        getRecommendationDetails: getRecommendationDetails,
        getUser:getUser
    };
})();

