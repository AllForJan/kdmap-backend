var http = require('http');
var express = require('express');
var app = express();
var fs = require("fs");
var mysql = require('mysql');
var utils = require('./utils.js');
var rest_client = require('./rest_client.js');

const port = 8080;
const mysql_host = "localhost";
const mysql_user = "root";
const mysql_password = "root";
const mysql_db = "hackathon"
const global_batch_size = 3;

// TESTING PURPOSE //
// var contents = fs.readFileSync("kd_sample.json");
// var jsonContent = JSON.parse(contents);
// TESTING PURPOSE //

var con = mysql.createConnection({
  host: mysql_host,
  user: mysql_user,
  password: mysql_password,
  database: mysql_db
});

app.get('/findByIcoAndYear', function (req, res) {
  var ico = req.query.ico.replace( /^\D+/g, '');
  console.log(ico);
  var year = req.query.year.replace( /^\D+/g, '');

  retval = [];

  // con.connect(function(err) {
  //   if (err) throw err;
    con.query(`select * from apa_ziadosti where ICO = ${ico} AND Rok = ${year};`, function (err, result, fields) {
      if (err) throw err;
      var gis_lokalita_diely = [];
     
      // map from sql DB
      result.forEach(element => {
        retval.push(utils.fromSqlToKD(element));
      });
      
      // get unique LOKALITA values
      var lokality = Array.from(new Set(retval.map(function(value,index) { return value.lokalita; })));

      // build LOKALITA IN (...) AND ZDKOD IN (...) array
      lokality.forEach(l => {
        var concrete_lokalita = retval.filter(element => element.lokalita == l);
        var concrete_diel = Array.from(new Set(concrete_lokalita.map(function(value,index) { return value.diel; })));
        gis_lokalita_diely.push(utils.buildLokalitaDielQuery(l, concrete_diel));
      })

      // call VUPOP
      var vupop_data = [];
      var batch_size = global_batch_size;

      console.log("VUPOP: calling for " + gis_lokalita_diely.length);
      for(var i = 1; i < gis_lokalita_diely.length + 1; i += batch_size){
        console.log(i + "|" + i*batch_size);
        console.log(gis_lokalita_diely.slice(i, i*batch_size));
        var batch_arr = rest_client.findPolygons({hist_layer_year: year, lokalita_diely: gis_lokalita_diely.slice(i-1, i*batch_size)}, rest_client.TERM_ICO_YEAR);

        if(batch_arr && batch_arr.features){
          batch_arr.features.forEach(e => {
            vupop_data.push(e);
          })
        }
      }
      console.log("VUPOP: Found " + vupop_data.length + " features");
      // join data with geometry
      if(vupop_data){
        retval.forEach(element =>{
          f = vupop_data.find(f => f.properties.ZKODKD == element.diel && f.properties.LOKALITA == element.lokalita);
          if (f != null){
            element.feature = Array(f);
          } else {
            element.feature = [];
          }
        })
      }

      setHeaders(res);
      res.send(retval);
      res.end();
    });
  // });
});

app.get('/findByPlace', function (req, res) {
  var place = req.query.place;

  retval = [];
  
  var batch_arr = rest_client.findPolygons({place}, rest_client.TERM_PLACE);

    

  res.send(batch_arr);
  
});

function setHeaders(res){
   // Website you wish to allow to connect
   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

   // Request methods you wish to allow
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

   // Request headers you wish to allow
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

   // Set to true if you need the website to include cookies in the requests sent
   // to the API (e.g. in case you use sessions)
   res.setHeader('Access-Control-Allow-Credentials', true);
}

/************ Init server ****************/ 
var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("KD map is listening at http://%s:%s\n", host, port)
})
