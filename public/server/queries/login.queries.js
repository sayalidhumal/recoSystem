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

    function getUser(req, res, next){
        var coyote_id = req.query.coyote_id;
        const results = [];

        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const query = client.query('SELECT * FROM "user" WHERE coyote_id =' + coyote_id + ';');
            query.on('row', function(row){
                results.push(row);
            });
            query.on('end', function(){
                done();
                return res.json(results);
            });
        });
    }

    /*
     name: createUser()
     description: adds a new user to the database
     parameter: user json obj
     */

    function createUser(req, res, next){
        console.log("req obj",req.body.user)
        const data = req.body.user;
        const results = [];
        var finalquery;
        console.log(data)
        pg.connect(connectionString, function(err, client, done){
            // Handle connection errors
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            // SQL Query > Insert Data
            const query = client.query('INSERT INTO "user"(coyote_id, name, email_id, phone, address, date_of_birth, password) VALUES ($1,$2,$3,$4,$5,$6,$7);',
                [ data.userID,data.name,data.email,data.phone,data.address,data.dateOfBirth,data.password]);

            switch(data.role){
                case 'student':
                    console.log("student");
                    const finalquery = client.query('INSERT INTO student(coyote_id, residency, ft_or_pt) VALUES ($1,$2,$3);',
                        [ data.userID,data.residency,data.ft_pt]);
                    finalquery.on('end', function(){
                        done();
                        return res.json(results);
                    });
                    break;
                case 'administrator':
                    console.log("admin");
                    const adminquery = client.query('INSERT INTO administrator(coyote_id) VALUES ($1);',
                        [ data.userID]);
                    adminquery.on('end', function(){
                        done();
                        return res.json(results);
                    });
                    break;
                case 'advisor':
                    console.log("adviser");
                    const advisorquery = client.query('INSERT INTO advisor(coyote_id) VALUES ($1);',
                        [ data.userID]);
                    advisorquery.on('end', function(){
                        done();
                        return res.json(results);
                    });
                    break;
            }


        });
    }

    module.exports = {
        getUser: getUser,
        createUser: createUser
    };
})();
