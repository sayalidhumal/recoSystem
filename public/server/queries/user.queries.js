/**
 * Created by sayalidhumal on 7/23/17.
 */
(function () {
    const express = require('express');
    const router = express.Router();
    const pg = require('pg');
    const path = require('path');
    const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/recoSystem';

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
        getEnrolledCourses: getEnrolledCourses
    };
})();

