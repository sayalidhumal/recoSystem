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

                if(!results.length){
                    admin.on('row', function(row){
                        results.push(row);
                    });
                    admin.on('end', function(){
                        done();
                        if(!results.length){

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

                            results[0]="administrator"
                            return res.json(results);
                        }
                    });

                }
                else {

                    results[0]="student"
                    return res.json(results);
                }

            });


        });
    }

    function getEnrolledCourses(req, res, next){
        const coyote_id = req.query.coyote_id;
        console.log(coyote_id)
        const results = [];
        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            //const coursesTaken = client.query("SELECT * FROM "+'"course_taken"' +"WHERE coyote_id ='" + coyote_id + "';");
            //const coursesTaken = client.query("SELECT t.course_id,t.grade,t.coyote_id,c.units,c.name FROM"+ '"course c"','"course_taken t"'+"WHERE t.course_id = c.course_id AND t.coyote_id='" + coyote_id + "';");
            const coursesEnrolled = client.query("SELECT t.course_id,t.grade,t.coyote_id,t.quarter_year,c.units,c.name FROM course c, course_taken t where t.course_id = c.course_id AND t.coyote_id ='" + coyote_id + "';");
            // const studentDetails = client.query('SELECT * FROM "studentDetails" WHERE "userID" =' + userID + ';');
            //
            // studentDetails.on('row', function(row){
            //     results.details.push(row);
            // });
            //
            // studentDetails.on('end', function(){
            //     done();
            //     return res.json(results);
            // });
            coursesEnrolled.on('row', function(row){
                results.push(row);
            });

            coursesEnrolled.on('end', function(){
                done();
                return res.json(results);
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
                query =client.query("SELECT * FROM"+ '"user"'+ "WHERE lower(name) LIKE '%" + name + "%';");
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
            const coursestaken = client.query('SELECT course_id FROM course_taken WHERE coyote_id =' + coyote_id + ';');

            const preference = client.query('SELECT degree_preference,course_count_preference,course_overload_preference,independent_study_preference,lecture_preference,summer_course_preference FROM student_preference WHERE coyote_id =' + coyote_id + ';');

            const prerequisites = client.query('SELECT course_id FROM student_prerequisite WHERE coyote_id =' + coyote_id + ';');

            const dayPreference = client.query('SELECT day_preference FROM day_preference WHERE coyote_id =' + coyote_id + ';');

            const timePreference = client.query('SELECT time_preference FROM time_preference WHERE coyote_id =' + coyote_id + ';');

            const path = client.query('SELECT current_recommendation_path FROM student WHERE coyote_id =' + coyote_id + ';')

            coursestaken.on('row', function(row){
                results.coursesTaken.push(row.course_id);
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

    function addRecommendationPath(req, res, next) {
        const data = req.body.path;
        const coyote_id = req.body.coyote_id;
        console.log(data)
        pg.connect(connectionString, function(err, client, done) {
            // Handle connection errors
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            // SQL Query > Insert Data
            const query = client.query('UPDATE student SET current_recommendation_path=($1) WHERE coyote_id=($2)',
                [data,coyote_id]);

            query.on('end', function(){
                done();
                return res;
            });

        })
    }

    function updateUser(req, res, next) {
        const data = req.body.user;

        console.log("data in query",data)

        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const query = client.query('UPDATE "user" SET  address=($1), name=($2),email_id=($3), phone=($4), date_of_birth=($5) WHERE coyote_id=($6)',[data.address,data.name,data.email_id,data.phone,data.date_of_birth,data.coyote_id]);
            query.on('end', function(){
                console.log("successful in updating");
                done();
                return res;
            });
        });

    }

    module.exports = {
        getEnrolledCourses: getEnrolledCourses,
        getUserRole:getUserRole,
        getRecommendationDetails: getRecommendationDetails,
        getUser:getUser,
        addRecommendationPath: addRecommendationPath,
        updateUser: updateUser
    };
})();

