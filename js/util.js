var mysql = require('mysql');
var http = require('http');

var portNum = 8080;

var NodeGeocoder = require('node-geocoder');
var options = {
    provider: 'google',
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'api-key', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

console.log("Setting up mysql connection..")

var dbPool = mysql.createPool({
    host: '127.0.0.1',
    database: 'web_iustar',
    user: 'root',
    password: '',
    port: 3306,
    connectionLimit: 5
});

dbPool.getConnection(function (err, connection) {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
    //connection.release();
});

function saveDb(id, latitude, longitude, gpstime) {
    console.log('saveDb');
 
        geocoder.reverse({ lat: latitude, lon: longitude })
            .then(function (res) {
                //console.log('Dir' + res[0].formattedAddress);
                //.log('INSERT INTO devices(NUM ,IMEI, LAT, LON,DIRECCION, FECHA) values("'+null+'","'+id+'","'+latitude+'","'+longitude+'","'+res[0].formattedAddress+'","'+gpstime+'")');

                let consulta = "SELECT * FROM devices ORDER BY FECHA DESC limit 1";
                var cl = dbPool.query(consulta, function (err, results, fields) {
                    if (err) return false;

                    console.log("JSON: " + results);
                    console.log(" RES -> " + results[0]['LAT'] + " " + results[0]['LON']);
                    
                    if (results[0]['DIRECCION'] !== res[0].formattedAddress.replace(/["']/g, "")) {
                        console.log('DIFERENTES ');
                        dbPool.query('INSERT INTO devices(NUM ,IMEI, LAT, LON,DIRECCION, FECHA) values("' + null + '","' + id + '","' + latitude + '","' + longitude + '","' + res[0].formattedAddress.replace(/["']/g, "") + '","' + gpstime + '")',
                            function (err, rows, fields) {
                                if (err) {
                                    console.log('error 2:: ' + err);
                                    throw err;
                                }
                                console.log('OK ');
                                         
                                return "OK";
                            });
                    } else {
                        console.log('IGUAL ');
                    }
                });

            })
            .catch(function (err) {
                console.log("ERROR: " + err);
            });

        // http.emit( 'data', gps )
    

}

module.exports = {
    saveDb
}
