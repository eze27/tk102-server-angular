var net = require('net');
var HOST = '192.168.15.7';
var PORT = 2345;
var util = require('./util');
var index = require('./js/index')
global.data = {};

net.createServer(function(sock) {

    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

    var sockets = [];

    sock.on('data', function(data) {
        console.log("DATA: " + data)

        sockets.push(sock);

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

            var lat = parseFloat(parseInt(latitude.substring(0, 2)) + parseFloat(latitude.substring(2, latitude.length)) / 60).toFixed(5);
            var long = parseFloat(parseInt(longitude.substring(0, 3)) + parseFloat(longitude.substring(2, longitude.length)) / 60).toFixed(5);
            long = -long;

            /*console.log("IMEI: "+devid+" msg: "+msg+" fecha: "+devdate+" adminnum: "+admin_num+" info: "+info+
               "time: "+time+" code: "+code+" lat: "+lat +" lon: "+long +" posy: "+posy+" posx: "+posx+
               "speed: "+speed+" altitud: "+altitude+" date: "+date);*/

            global.data = {
                "imei": devid,
                "lat": lat,
                "lon": long,
                "date": date
            }
            console.log(data);


            //util.saveDb(devid,lat,long,date );

            //If we receive a SOS we cancel the repeat mode
            if (msg == "help me") {
                sock.write('**,' + res[0] + ',E');
                console.log('SOS repeat disabled');
            }
        }


    });


    sock.on('close', function(data) {
        let index = sockets.findIndex(function(o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });

}).listen(PORT, HOST, function() {
    console.log("listening on port: " + PORT + " and host: " + HOST);
});

index.server.listen(PORT = 3000, () => {
    console.log(`Server running in http://localhost:${PORT}`)
});

index.io.on('connection', function(socket) {
    console.log(`client: ${socket.id}`)
        //enviando numero aleatorio cada dos segundo al cliente
    setInterval(() => {
        socket.emit('data', global.data)
    }, 5000);
    //recibiendo el numero aleatorio del cliente
    socket.on('client/random', (num) => {
        console.log(num);
    });
});