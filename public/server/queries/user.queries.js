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
        var userID = req.query.userID;
        var results =[]

        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const student = client.query('SELECT * FROM student WHERE coyote_id =' + userID + ';');
            const admin = client.query('SELECT * FROM administrator WHERE coyote_id =' + userID + ';');
            const advisor = client.query('SELECT * FROM advisor WHERE coyote_id =' + userID + ';');

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

    module.exports = {
        getEnrolledCourses: getEnrolledCourses,
        getUserRole:getUserRole
    };
})();

