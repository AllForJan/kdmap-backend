exports.fromSqlToKD = function (sqlObject) {
    var obj = {
        ziadatel: "", 
        rok:"", 
        ico:"",
        lokalita:"",
        diel:"",
        kultura:"",
        vymera:"",
        feature: []
    }

    obj.ziadatel = getField(sqlObject.Ziadatel);
    obj.rok = getField(sqlObject.Rok);
    obj.ico = getField(sqlObject.ICO);
    obj.lokalita = getField(sqlObject.Lokalita);
    obj.diel = getField(sqlObject.Diel);
    obj.kultura = getField(sqlObject.Kultura)
    obj.vymera = getField(sqlObject.Vymera);
    obj.feature = [];

    return obj;
};

exports.buildLokalitaDielQuery = function(lokalita_arr, diely_arr){
    let q_lokalita = "%27" + Array(lokalita_arr).join("%27%2C%27") + "%27";
    let q_diely = "%27" + diely_arr.join("%27%2C%27") + "%27";

    return `%28LOKALITA+IN+%28${q_lokalita}%29` + "+AND+" + `ZKODKD+IN+%28${q_diely}%29%29`
}

exports.buildArcGisUrlIcoYear = function(data){
    if(data){
        let gis_hist_layer_year = data.hist_layer_year;
        let gis_lokalita_and_diely = data.lokalita_diely.join("+OR+").replace(/\//g,'%2F');

        return `https://portal.vupop.sk/arcgis/rest/services/LPIS/Historicke_vrstvy_${gis_hist_layer_year}/MapServer/0/query?where=${gis_lokalita_and_diely}&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson`;
    }
    return "";
}

exports.buildArcGisUrlPlace = function(data){
    if(data){
        var place = String(data);
        return `https://portal.vupop.sk/arcgis/rest/services/uzemne_clenenie/uzemne_clenenie/MapServer/1/query?where=NM2+LIKE+%27%25${place}%25%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelEnvelopeIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=10&f=pjson`
    }
}

function getField(field){
    if(field){
        return field;
    } else {
        return "";
    }
}

