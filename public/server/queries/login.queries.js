(function () {
    const express = require('express');
    const router = express.Router();
    const pg = require('pg');
    const path = require('path');
    const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/recoSystem';

    /*
    name: getUser()
    description: get the user details from the server for login
    parameter: userID
     */

    function getUser(req, res, next){
        var userID = req.query.userID;
        const results = [];
        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const query = client.query('SELECT * FROM users WHERE "userID" =' + userID + ';');
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

        pg.connect(connectionString, function(err, client, done){
            // Handle connection errors
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            // SQL Query > Insert Data
                const query = client.query('INSERT INTO users(password, role, name, email, phone, "userID", address, "dateOfBirth") VALUES ($1,$2,$3,$4,$5,$6,$7,$8);',
                    [ data.password,data.role,data.name,data.email,data.phone,data.userID,data.address,data.dateOfBirth]);
                query.on('end', function(){
                    done();
                    return res.json(results);
                });
        });
    }

    module.exports = {
        getUser: getUser,
        createUser: createUser
    };
})();
