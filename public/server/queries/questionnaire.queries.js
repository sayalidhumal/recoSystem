(function () {
    const express = require('express');
    const router = express.Router();
    const pg = require('pg');
    const path = require('path');
    const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/recoSystem';


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
            const query = client.query('INSERT INTO "studentPreference"("typeOfCourse", "dayPreference", "graduationType", "userID","timePreference") VALUES ($1,$2,$3,$4,$5);',
                [data.lectureType,data.lectureDays,data.gradType,data.userID,data.lectureTimes]);
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
