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
            prerequisites:[],
            constraints: []
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
            const constraints = client.query('SELECT * FROM course_constraints;');


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
                //return res.json(results);
            })

            constraints.on('row',function (row) {
                results.constraints.push(row);
            });

            constraints.on('end',function () {
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
        req.body.course.session_no =1;
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
            const query = client.query('INSERT INTO course(course_id, name, has_lab, course_level, units, course_dept) VALUES ($1,$2,$3,$4,$5,$6);',
                [ data.course_id,data.name,data.has_lab,data.course_level,data.units,data.course_dept]);
            const query2 = client.query('INSERT INTO course_schedule(course_id,quarter, year, instructor, course_day, course_start_time, course_end_time, lab_day, lab_start_time, lab_end_time, session_no) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);',
                [ data.course_id,data.quarter,data.year,data.instructor,data.course_day,data.course_start_time,data.course_end_time,data.lab_day,data.lab_start_time,data.lab_end_time, data.session_no]);
            if(data.course_type == 'Core'){
                console.log("inside Core")
                const query3 = client.query('INSERT INTO core_course(course_id) VALUES ($1));',
                    [data.course_id]);
                query3.on('end', function(){
                    return res.json(results);
                    done();
                });
            }
            else if(data.course_type == 'Elective')
            {
                console.log("inside elective")
                const query4 = client.query('INSERT INTO elective_course(course_id) VALUES ($1));',
                    [data.course_id]);

                query4.on('end', function(){
                    done();
                    return res.json(results);
                });
            }
        });
    }

    function addPrerequisite(req, res, next){
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

    function viewPrerequisite(req, res, next){
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
            const viewPrerequisite = client.query("SELECT t.course_id,c.name FROM student_prerequisite t,course c WHERE t.course_id= c.course_id AND t.coyote_id = '" + coyote_id + "';");
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
            viewPrerequisite.on('row', function(row){
                results.push(row);
            });

            viewPrerequisite.on('end', function(){
                done();
                return res.json(results);
            });
        });
    }

    function getPrerequisite(req, res, next){
        const results = [];
        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            //const coursesTaken = client.query("SELECT * FROM "+'"course_taken"' +"WHERE coyote_id ='" + coyote_id + "';");
            //const coursesTaken = client.query("SELECT t.course_id,t.grade,t.coyote_id,c.units,c.name FROM"+ '"course c"','"course_taken t"'+"WHERE t.course_id = c.course_id AND t.coyote_id='" + coyote_id + "';");
            const getPrerequisite = client.query("SELECT p.prerequisite_id,c.name FROM course_prerequisite p, course c where p.prerequisite_id = c.course_id;");
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
            getPrerequisite.on('row', function(row){
                results.push(row);
            });

            getPrerequisite.on('end', function(){
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

    function updateCourse(req, res, next) {
        const data = req.body.schedule;
        console.log("data in query",data)

        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const query = client.query('UPDATE course_schedule SET course_day=($1), instructor=($2), course_start_time=($3), course_end_time=($4), lab_day=($5), lab_start_time=($6), lab_end_time=($7) WHERE course_id=($8) AND quarter=($9) AND year=($10)',
                [data.course_day,data.instructor,data.course_start_time,data.course_end_time,data.lab_day,data.lab_start_time,data.lab_end_time,data.course_id,data.quarter,data.year]);
            query.on('end', function(){
                console.log("successful in updating")
                done();
                return res.json("successfull");
            });
        });

    }

    function addSchedule(req, res, next) {
        console.log("req obj",req.body.schedule)
        const data = req.body.schedule;
        const results = [];

        pg.connect(connectionString, function(err, client, done){
            // Handle connection errors
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const query = client.query('INSERT INTO course_schedule(course_id,course_day,instructor,course_start_time,course_end_time,lab_day,lab_start_time,lab_end_time,quarter,year,session_no) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);',
                [data.course_id,data.course_day,data.instructor,data.course_start_time,data.course_end_time,data.lab_day,data.lab_start_time,data.lab_end_time,data.quarter,data.year,1]);
            query.on('end', function () {
                done();
                return res.json("Successful");
            });
        });
    }

    function getCourseWithSchedule(req, res, next) {
        var course_id = req.query.courseID;
        const results = [];
        const schedules =[]

        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }

            const query = client.query('SELECT * FROM course  WHERE course_id = ' + course_id + ';');
            query.on('row', function(row){
                results.push(row);
            });
            const schedule = client.query('SELECT * FROM course_schedule  WHERE course_id = ' + course_id + ';')
            schedule.on('row', function(row){
                schedules.push(row);
            });
            query.on('end', function(){
                done();
                //return res.json(results);
            });
            schedule.on('end', function(){
                done();
                results[0].schedule = schedules
                return res.json(results);
            });
        });
    }

    function deletePrerequisite(req, res, next) {
        const coyote_id= req.query.coyote_id;
        const course_id = req.query.course_id
        const results = [];
        console.log(req.params,req)
        pg.connect(connectionString, function(err, client, done){
            // Handle connection errors
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const query = client.query('DELETE FROM "student_prerequisite" WHERE coyote_id =($1) AND course_id=($2); ',
                [coyote_id,course_id]);
            query.on('end', function () {
                done();
                return res.json(results);
            });
        });
    }

    function deleteCourseSchedule(req, res, next) {
        const course= req.query.course;
        console.log(course)
        pg.connect(connectionString, function(err, client, done){
            // Handle connection errors
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const query = client.query('DELETE FROM "course_schedule" WHERE course_id =($1) AND quarter=($2) AND year=($3) AND session_no=($4); ',
                [course.course_id,course.quarter,course.year,course.session_no]);
            query.on('end', function () {
                done();
                console.log("success")
                return res.json("success");
            });
        });
    }

    module.exports = {
        getCourse: getCourse,
        getCourseType:getCourseType,
        getCourseDetailsForYear: getCourseDetailsForYear,
        getAllCourses:getAllCourses,
        createCourse:createCourse,
        addPrerequisite:addPrerequisite,
        viewPrerequisite:viewPrerequisite,
        getPrerequisite:getPrerequisite,
        updateCourse:updateCourse,
        addSchedule:addSchedule,
        getCourseWithSchedule:getCourseWithSchedule,
        deletePrerequisite: deletePrerequisite,
        deleteCourseSchedule:deleteCourseSchedule
    };
})();
