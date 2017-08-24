(function () {
    const express = require('express');
    const router = express.Router();
    const pg = require('pg');
    const path = require('path');
    const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/recomSystem';


    /*
     name: addPreference()
     description: adds a user preference to the database
     parameter: preference json obj
     */

    function addPreference(req, res, next){
        console.log("req obj",req.body.preferences)
        const data = req.body.preferences;
        const results = [];

        pg.connect(connectionString, function(err, client, done){
            // Handle connection errors
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            // SQL Query > Insert Data
            const query = client.query('INSERT INTO student_preference ("coyote_id", "degree_preference", "course_count_preference", "lecture_preference","summer_course_preference","course_overload_preference","independent_study_preference") VALUES ($1,$2,$3,$4,$5,$6,$7);',
                [data.userID,data.degree_preference,data.course_count_preference,data.lecture_preference,data.summer_course_preference,data.course_overload_preference,data.independent_study_preference]);
            query.on('end', function(){
                done();
                return res.json(results);
            });
        });
    }

    module.exports = {
        addPreference: addPreference
    };
})();
