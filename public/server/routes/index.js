const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const physicalQueries = require('../queries/physical.queries.js');
const clubsQueries = require('../queries/clubs.queries');
const loginQueries = require('../queries/login.queries')

router.get('/', function(req, res, next){
    console.log(path.join(
        __dirname, '..','..','index.html'))
    res.sendFile(path.join(
    __dirname, '..','..','index.html'));
});

router.get('/getPhysicalClubs', physicalQueries.getPhysicalClubs);

router.post('/addClubs', clubsQueries.addClubs);

router.get('/login', loginQueries.getUser);

module.exports = router;
