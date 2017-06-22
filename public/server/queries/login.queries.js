(function () {
    const express = require('express');
    const router = express.Router();
    const pg = require('pg');
    const path = require('path');
    const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/recoSystem';

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

    module.exports = {
        getUser: getUser
    };
})();
