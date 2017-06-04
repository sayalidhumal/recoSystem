(function () {
  const express = require('express');
  const router = express.Router();
  const pg = require('pg');
  const path = require('path');
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5434/cssp';

  function addClubs(req, res, next){
    console.log("req obj",req.body.data)
    const data = req.body.data;
    const results = [];

    pg.connect(connectionString, function(err, client, done){
      // Handle connection errors
      if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }
      // SQL Query > Insert Data
      for(i=0;i<data.length;i++){
        //console.log(data[i].Name,i+7)
        const query = client.query('INSERT INTO clubs(id, name, contact_name, phone_no, dimension_id, email, category) VALUES ($1,$2,$3,$4,$5,$6,$7);',
          [ i+70,data[i].Name, data[i].ContactName, data[i].Number,41,data[i].Address,data[i].Category]);
        query.on('end', function(){
          done();
          //return res.json(results);
        });
      }
    });
  }

  module.exports = {
    addClubs: addClubs
  };
})();

