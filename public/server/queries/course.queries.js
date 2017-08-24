(function () {
    const express = require('express');
    const router = express.Router();
    const pg = require('pg');
    const path = require('path');
    const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/recomSystem';

    /*
     name: getUser()
     description: get the user details from the server for login
     parameter: userID
     */

    function getCourse(req, res, next){
        var course_id = req.query.courseID;
        var course_name = req.query.courseName;
        console.log(course_name)
        const results = [];

        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            if(course_id){
                const query = client.query('SELECT * FROM course  WHERE course_id = ' + course_id + ';');
                query.on('row', function(row){
                    //results.push({type:"elective"});
                    results.push(row);
                });
                query.on('end', function(){
                    done();
                    return res.json(results);
                });
            }else {
                query =client.query("SELECT * FROM course c WHERE c.name='" + course_name + "';");
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

    function getCourseType(req, res, next) {
        var courseID = req.query.courseID;
        var results =[]

        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const elective = client.query('SELECT * FROM elective_course WHERE course_id =' + courseID + ';');
            const core = client.query('SELECT * FROM core_course WHERE course_id =' + courseID + ';');

            elective.on('row', function(row){
                results.push(row);
            });
            elective.on('end', function(){
                done();

                if(!results.length){
                    core.on('row', function(row){
                        results.push(row);
                    });
                    core.on('end', function(){
                        done();
                            results[0]="Core"
                            return res.json(results);
                    });
                }
                else {
                    console.log("student")
                    results[0]="Elective"
                    return res.json(results);
                }
            });

        });
    }


    function getCourseDetailsForYear(req, res, next){
        var course_id = req.query.courseID;
        var currentYear = req.query.currentYear;
        var nextYear = req.query.nextYear;
        console.log(nextYear)
        const results = {
            details: [],
            schedule: [],
            prerequisite: []
        }

        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const query = client.query('SELECT * FROM course WHERE course_id = ' + course_id + ';');
            const schedule = client.query("SELECT * FROM course_schedule WHERE course_id = " + course_id +" AND ((quarter = 'Fall' AND year = " + currentYear +") OR (quarter = 'Winter' AND year = " + nextYear +") OR (quarter = 'Spring' AND year = " + nextYear +") OR (quarter = 'Summer' AND year =" + nextYear +")) ;");
            const prereq = client.query('SELECT * FROM course_prerequisite WHERE course_id = ' + course_id + ';')
            prereq.on('row', function(row){
                results.prerequisite.push(row);
            });
            prereq.on('end', function(){
                done();
                return res.json(results);
            });

            schedule.on('row', function(row){
                results.schedule.push(row);
            });
            schedule.on('end', function(){
                done();
                //return res.json(results);
            });

            query.on('row', function(row){
                results.details.push(row);
            });
            query.on('end', function(){
                done();
                //return res.json(results);
            });


        });
    }


    module.exports = {
        getCourse: getCourse,
        getCourseType:getCourseType,
        getCourseDetailsForYear: getCourseDetailsForYear
    };
})();
