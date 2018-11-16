var net = require('net');
var HOST = '192.168.15.10';
var PORT = 1234;
var util = require('./util');
var index = require('./js/index');
var cycle = require('cycle');
global.data = {};
var sockets = [];
let counter = 0;
global.socketss = {}
let listaImei;
util.getListaImei().then(data => {
  listaImei = data;
});


var server = net.createServer(function (sock) {
  sock.id = counter++;
  global.socketss[sock.id] = sock;

  console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

  //console.log('sock ' + sock);

  sockets.push(sock);
  sock.on('end', data => {
    delete global.socketss[sock.id];
    Object.entries(global.socketss).forEach(([keys, sc]) => {
      console.log(`${global.socketss.name}: `);
      console.log('has disconnected 3\n');
    });
    var b = cycle.decycle(global.socketss);
      console.log('global 3 - ' + JSON.stringify(b));
    console.log(`${global.socketss.name} has disconnected`);
  });
  sock.on('data', function (data) {
    // console.log("DATA: " + data )




    if (data.toString().match("##,imei:.*,A;")) {
      var res = data.toString().split(",");
      var imei = res[1];
      sock.write('**,' + res[1] + ',C,20s');
      sock.write('LOAD');
      console.log("LOAD Sended");
    } else if (data.toString().match("^\\d+")) {
      var res = data.toString().split(",");
      var comdevid = res[0].toString().split(":");
      var devid = comdevid[1];
      sock.write('ON');
      console.log('ON Sended');
    } else if (data.toString().match(devid)) {
      var res = data.toString().split(",");
      var comdevid = res[0].toString().split(":");
      var devid = comdevid[1];
      var msg = res[1];
      var devdate = res[2];
      var admin_num = res[3];
      var info = res[4];
      var time = res[5];
      var code = res[6];
      var latitude = res[7];
      var posy = res[8];
      var longitude = res[9];
      var posx = res[10];
      var speed = res[11];
      var altitude = res[12];
      var date = new Date();
      var dd = date.getDate();
      var mm = date.getMonth() + 1; //January is 0!
      var yyyy = date.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      var today = yyyy + '-' + mm + '-' + dd;
      var h = date.getHours();
      var m = date.getMinutes(); //January is 0!
      var s = date.getSeconds();
      var time = h + ":" + m + ":" + s;
      var lat = parseFloat(parseInt(latitude.substring(0, 2)) + parseFloat(latitude.substring(2, latitude.length)) / 60).toFixed(5);
      var long = parseFloat(parseInt(longitude.substring(0, 3)) + parseFloat(longitude.substring(2, longitude.length)) / 60).toFixed(5);
      long = -long;

      /*console.log("IMEI: "+devid+" msg: "+msg+" fecha: "+devdate+" adminnum: "+admin_num+" info: "+info+
         "time: "+time+" code: "+code+" lat: "+lat +" lon: "+long +" posy: "+posy+" posx: "+posx+
         "speed: "+speed+" altitud: "+altitude+" date: "+date);*/


      //  console.log('socketss '+JSON.parseJSON(JSON.stringify(socketss)));
      Object.entries(global.socketss).forEach(([key, cs]) => {
        console.log('key ' + key);
        console.log('id' + sock.id);

        console.log('id2' + sock.id);
        for (let index = 0; index < listaImei.length; index++) {
          console.log('index ' + index + ' ' + listaImei[index].IMEI + ' ' + listaImei[index].USERID)
          if (listaImei[index].IMEI == devid) {

            global.socketss[sock.id] = {
              'index': sock.id,
              "idnotificador": listaImei[index].USERID,
              "imei": devid,
              "lat": parseFloat(lat),
              "lon": parseFloat(long),
              "date": today
            }
            //id, latitude, longitude, gpstime,time

          }

        }
      });

      // console.log(glosocketss.data);
      var b = cycle.decycle(global.socketss);
      console.log('global 1 - ' + JSON.stringify(b));


     util.saveDb(devid,lat,long,today,time );

      //If we receive a SOS we cancel the repeat mode
      if (msg == "help me") {
        sock.write('**,' + res[0] + ',E');
        console.log('SOS repeat disabled');
      }
    }



  });

  // Get current connections count.
  server.getConnections(function (err, count) {
    if (!err) {
      // Print current connection count in server console.
      console.log("gps conectado ", count);
    } else {
      console.error(JSON.stringify(err));
    }

  });
  sock.on('close', function (data) {
    delete global.socketss[sock.id];
    Object.entries(global.socketss).forEach(([keys, sc]) => {
      console.log(`${global.socketss.imei}: `);
      console.log('has disconnected\n');
    });
    var b = cycle.decycle(global.socketss);
      console.log('global 2 - ' + JSON.stringify(b));
    console.log(`${global.socketss.imei} has disconnected`);
  });

  sock.on('error', (err) => {
    // handle errors here
    console.log('err ' + err)

    if (err === 'Error: read ECONNRESET' || err.code === 'EADDRINUSE') {
      console.log('errrrrr');

      setTimeout(() => {
        server.close();
        server.listen(PORT, HOST);
      }, 1000);
    }
    //throw err;
  });


}).listen(PORT, HOST, function () {
  console.log("listening on port: " + PORT + " and host: " + HOST);
});


index.server.listen(PORT = 3000, () => {
  console.log(`Server running in http://localhost:${PORT}`)
});

index.io.on('connection', function (socket) {
  console.log(`client: ${socket.id}`)
  //enviando numero aleatorio cada dos segundo al cliente

  setInterval(() => {
    //socket.emit('sockets', sockets)
    var b = cycle.decycle(global.socketss);
    console.log('datos + ' + JSON.stringify(b));
    socket.emit('data', b);
  }, 8000);
  //recibiendo el numero aleatorio del cliente
  socket.on('client/random', (num) => {
    console.log(num);
  });
});
