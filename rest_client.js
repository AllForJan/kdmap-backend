// var req = require('request-promise');
var utils = require('./utils.js');
var request = require('sync-request');

exports.TERM_ICO_YEAR = 5;
exports.TERM_PLACE = 6

exports.findPolygons = function (data, term) {
    var req_arcgis_url = "";
    if(this.TERM_ICO_YEAR){
        console.log(JSON.stringify(data.lokalita_diely));
        req_arcgis_url = utils.buildArcGisUrlIcoYear(data);
    } else if(this.TERM_PLACE){
        req_arcgis_url = utils.buildArcGisUrlPlace(data);
    }
    
    var response = request('GET', req_arcgis_url);
    var body;
    try {
        body = JSON.parse(response.getBody())
    } catch (error) {
        console.log("VUPOP: Not able to parse response, error occurred.");
    }
    if(!body){
        return [];
    }
    return body;
}






