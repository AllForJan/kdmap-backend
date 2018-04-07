// var req = require('request-promise');
var utils = require('./utils.js');
var request = require('sync-request');
var rq = require('request');

var querystring = require('querystring');
var nQuery = require('nodeQuery');

const fetch = require("node-fetch");


exports.TERM_ICO_YEAR = 5;
exports.TERM_PLACE = 6

exports.findPolygonsGet = function (data, term) {
    var req_arcgis_url = "";
    if (term == this.TERM_ICO_YEAR) {
        console.log(JSON.stringify(data.lokalita_diely));
        req_arcgis_url = utils.buildArcGisUrlIcoYear(data);
    } else if (term == this.TERM_PLACE) {
        req_arcgis_url = utils.buildArcGisUrlPlace(data);
    }
    // console.log(req_arcgis_url);

    var response = request('GET', req_arcgis_url);
    try {
        body = JSON.parse(response.getBody())
    } catch (error) {
        console.log("VUPOP: Not able to parse response, error occurred.");
    }
    if (!body) {
        return [];
    }
    return body;
}

exports.findPolygonsPost = function (data, callback) {
    var ticker = 0, max_tick = 100000;
    var res_body;

    var form = {
        geometry: JSON.stringify(data.geometry),
        geometryType: 'esriGeometryPolygon',
        outFields: '*',
        inSR: 'geojson:0,1,3,4,5,6,7,8,9,10,12,24,27,30',
        f: 'geojson'
    };
    
    var formData = querystring.stringify(form);
    var contentLength = formData.length;

    rq({
        headers: {
          'Content-Length': contentLength,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: 'https://portal.vupop.sk/arcgis/rest/services/LPIS/Kulturne_diely/MapServer/0/query',
        body: formData,
        method: 'POST'
      }, function (err, res, body) {
           res_body = body;
           
    });

    try {
        console.log(res_body);
        body = JSON.parse(res_body);
    } catch (error) {
        console.log("VUPOP: Not able to parse response, error occurred.");
    }
    if (!body) {
        return [];
    }
    return res_body;
}






