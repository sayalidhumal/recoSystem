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
                //return res.json(results);
            });
            for(var i = 0;i<data.day_preference.length;i++){
                const day_preference = client.query('INSERT INTO day_preference ("coyote_id", "day_preference") VALUES ($1,$2);',
                    [data.userID,data.day_preference[i]]);
                day_preference.on('end', function(){
                    done();
                    //return res.json(results);
                });
            }



            for(var i = 0;i<data.time_preference.length;i++){
                const time_preference = client.query('INSERT INTO time_preference ("coyote_id", "time_preference") VALUES ($1,$2);',
                    [data.userID,data.time_preference[i]]);
                time_preference.on('end', function(){
                    done();
                    return res.json(results);
                });
            }

        });
    }

    function getPreference(req, res, next){
        console.log("req obj",req.query.coyote_id)
        const coyote_id = req.query.coyote_id;
        const results = {
            preference: [],
            day_preference:[],
            time_preference:[]
        };
        console.log(results);

        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const query =client.query("SELECT * FROM student_preference where coyote_id ='" + coyote_id + "';");
            const day_preference =client.query("SELECT * FROM day_preference where coyote_id ='" + coyote_id + "';");
            const time_preference =client.query("SELECT * FROM time_preference where coyote_id ='" + coyote_id + "';");
                query.on('row', function(row){
                    console.log(row)
                    results.preference.push(row);
                });
                query.on('end', function(){
                    done();
                    //return res.json(results);
                });
            day_preference.on('row', function(row){
                console.log(row)
                results.day_preference.push(row);
            });
            day_preference.on('end', function(){
                done();
                //return res.json(results);
            });
            time_preference.on('row', function(row){
                console.log(row)
                results.time_preference.push(row);
            });
            time_preference.on('end', function(){
                done();
                return res.json(results);
            });
        });
    }


    module.exports = {
        addPreference: addPreference,
        getPreference: getPreference
    };
})();
