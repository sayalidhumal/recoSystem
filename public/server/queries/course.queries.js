(function () {
    const express = require('express');
    const router = express.Router();
    const pg = require('pg');
    const path = require('path');
    const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/recomSystem';

    function getAllCourses(req, res, next){
        var currentYear = req.query.currentYear;
        const results = {
            electives:[],
            core:[],
            schedule:[],
            prerequisites:[]
        }

        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const core = client.query('SELECT c.course_id, c.has_lab, c.course_level, c.units, c.course_dept, c.name FROM core_course e INNER JOIN course c ON e.course_id=c.course_id');
            const elective = client.query('SELECT c.course_id, c.has_lab, c.course_level, c.units, c.course_dept, c.name FROM elective_course e INNER JOIN course c ON e.course_id=c.course_id');
            const prerequisites = client.query('SELECT c.course_id, e.prerequisite_id, c.has_lab, c.course_level, c.units, c.course_dept, c.name FROM course_prerequisite e INNER JOIN course c ON e.course_id=c.course_id');
            const schedule = client.query('SELECT * FROM course_schedule  WHERE year >= ' + currentYear + ';');


            core.on('row',function (row) {
                results.core.push(row);
            });

            core.on('end',function () {
                done();
            });

            elective.on('row',function (row) {
                results.electives.push(row);
            });

            elective.on('end',function () {
                done();
                //return res.json(results);
            });

            prerequisites.on('row',function (row) {
                results.prerequisites.push(row);
            });

            prerequisites.on('end',function () {
                done();
                //return res.json(results);
            });

            schedule.on('row',function (row) {
                results.schedule.push(row);
            });

            schedule.on('end',function () {
                done();
                return res.json(results);
            })

        });
    }

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
                course_name = course_name.toLowerCase();
                query =client.query("SELECT * FROM course c WHERE lower(c.name) LIKE '%" + course_name + "%';");
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

       function createCourse(req, res, next){
        console.log("req obj",req.body.course)
        const data = req.body.course;
        const results = [];
        var finalquery;
        console.log(data);

        pg.connect(connectionString, function(err, client, done){
            // Handle connection errors
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const query = client.query('INSERT INTO "course"(course_id, name, has_lab, course_level, units, course_dept) VALUES ($1,$2,$3,$4,$5,$6);',
                [ data.course_id,data.name,data.has_lab,data.course_level,data.units,data.course_dept]);
            const query2 = client.query('INSERT INTO "course_schedule"(quarter, year, instructor, course_day, course_start_time, course_end_time, lab_day, lab_start_time, lab_end_time) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);',
                [ data.quarter,data.year,data.instructor,data.course_day,data.course_start_time,data.course_end_time,data.lab_day,data.lab_start_time,data]);
            query.on('end', function(){
                done();
                return res.json(results);
            });
            query2.on('end', function(){
                done();
                return res.json(results);
            });
        });
    }


    function addPrerequisite(req, res, next){
        console.log("req obj",req.body.data)
        const data = req.body.data;
        const results = [];
        var finalquery;
        console.log(data);

        pg.connect(connectionString, function(err, client, done){
            // Handle connection errors
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const query = client.query('INSERT INTO "student_prerequisite"(coyote_id,course_id) VALUES ($1,$2);',
                [data.coyote_id,data.course_id]);
                query.on('end', function () {
                    done();
                    return res.json(results);
                });
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
        getCourseDetailsForYear: getCourseDetailsForYear,
        getAllCourses:getAllCourses,
        createCourse:createCourse,
        addPrerequisite:addPrerequisite
    };
})();
