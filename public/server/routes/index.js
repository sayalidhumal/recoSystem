const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const physicalQueries = require('../queries/physical.queries.js');
const clubsQueries = require('../queries/clubs.queries')
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5434/cssp';

router.get('/', function(req, res, next){
    res.sendFile(path.join(
    __dirname, '..','..','app','index.html'));
});

router.get('/getPhysicalClubs', physicalQueries.getPhysicalClubs);

router.post('/addClubs', clubsQueries.addClubs);

module.exports = router;
