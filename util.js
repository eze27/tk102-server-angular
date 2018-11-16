var mysql = require('mysql');
var http = require('http');
var dateFormat = require('dateformat');
var portNum = 8080;

var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyD6Dkzm9xw3-0HSgt293cvZzrfS3eoojgM', // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

console.log("Setting up mysql connection..")

var dbPool = mysql.createPool({
  host: '192.168.15.8',
  database: 'web_iustar',
  user: 'Ezequiel',
  password: '1234',
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

function getListaImei(){
  let consulta = 'SELECT * FROM  devicesn';
return new Promise( ( resolve, reject ) => {
  dbPool.query( consulta, ( err, rows ) => {
      if ( err ){
        return reject( err );
      }

     resolve( rows );
  } );
} );
}

function saveDb(id, latitude, longitude, gpstime,time) {
  console.log('Lat: ' + latitude + 'lng: ' + longitude);
  var day = dateFormat(new Date(gpstime), "yyyy-mm-dd");
  geocoder.reverse({
      lat: latitude,
      lon: longitude
    })
    .then(function (res) {
      //console.log('Dir' + res[0].formattedAddress);
      //.log('INSERT INTO devices(NUM ,IMEI, LAT, LON,DIRECCION, FECHA) values("'+null+'","'+id+'","'+latitude+'","'+longitude+'","'+res[0].formattedAddress+'","'+gpstime+'")');

      let consulta = 'SELECT * FROM historialn WHERE IMEI="' + id + '" ORDER BY FECHA ASC LIMIT 0, 1';
      var cl = dbPool.query(consulta, function (err, results, fields) {
        if (err) return false;

        if (results == '') {
          console.log('cero data para imei ' + id)
          dbPool.query('INSERT INTO historialn(NUM ,IMEI, LAT, LON,DIRECCION, FECHA,HORA) values("' + null + '","' + id + '","' + latitude + '","' + longitude + '","' + res[0].formattedAddress.replace(/["']/g, "") + '","' + day +'","'+time+'")',
            function (err, rows, fields) {
              console.log('se guarda ');
              if (err) {
                console.log('error 2:: ' + err);
                ;
              }
              console.log('OK ');

              return "OK";
            });
        }else {



        console.log(" DIRECCION ANTERIOR -> " + results[0]['DIRECCION']);
        console.log(" DIRECCION GPS -> " + res[0].formattedAddress.replace(/["']/g, ""));

        if (results[0]['DIRECCION'] === res[0].formattedAddress.replace(/["']/g, "")) {
          console.log('No guarda ');

        } else {

          dbPool.query('INSERT INTO historialn(NUM ,IMEI, LAT, LON,DIRECCION, FECHA,HORA) values("' + null + '","' + id + '","' + latitude + '","' + longitude + '","' + res[0].formattedAddress.replace(/["']/g, "") + '","' + day +'","'+time+'")',
            function (err, rows, fields) {
              console.log('se guarda ');
              if (err) {
                console.log('error 2:: ' + err);
                return err;
              }
              console.log('OK ');

              return "OK";
            });
        }
      }

      });

    })
    .catch(function (err) {
      console.log("ERROR: " + err);
    });

  // http.emit( 'data', gps )


}

module.exports = {
  saveDb,
  getListaImei
}
