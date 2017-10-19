(function () {
    const express = require('express');
    const router = express.Router();
    const pg = require('pg');
    const path = require('path');
    const nodemailer = require('nodemailer');
    var Cryptr = require('cryptr'),
        cryptr = new Cryptr('myTotalySecretKey');
    const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/recomSystem';

    /*
    name: getUser()
    description: get the user details from the server for login
    parameter: userID
     */

    function getUser(req, res, next){
        var coyote_id = req.query.coyote_id;
        var results = [];

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
                results[0]["password"] = cryptr.decrypt(results[0]["password"]);
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

    function resetPassword(req, res,next) {
        var email = req.body.email;
        var code = req.body.code;
        console.log("$$$$$$",code,email);
        var text = 'Code to reset password is: '+ code;
        var mailOptions = {
            from: 'saily.d8@gmail.com',
            to: email,
            subject: 'Reset password',
            text: text
        };
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'saily.d8@gmail.com',
                pass: 'i hate lovestories'
            }
        });

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
                res.json({yo: 'error'});
            }else{
                console.log('Message sent: ' + info.response);
                res.json({yo: info.response});
            }
        });
    }

    function changePassword(req, res,next) {
        const coyote_id = req.body.coyote_id;
        const password =  cryptr.encrypt(req.body.password);

        pg.connect(connectionString, function(err, client, done){
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            const query = client.query('UPDATE "user" SET  password=($1) WHERE coyote_id=($2)',[password,coyote_id]);
            query.on('end', function(){
                done();
                return res.json('Success');
            });
        });
    }

    module.exports = {
        getUser: getUser,
        createUser: createUser,
        resetPassword: resetPassword,
        changePassword:changePassword
    };
})();
