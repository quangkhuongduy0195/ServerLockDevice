var path = require("path");
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var  {LocalStorage} = require('node-localstorage');
const { Console } = require("console");
const PORT = process.env.PORT || 3000;
var localStorage = new LocalStorage('./device');
var clientConnects = 0;
var storage = require('./stores/local');
//Tạo socket 
io.on('connection', function (socket) {
    clientConnects++;
    console.log('Welcome to server: '+ clientConnects);
    socket.broadcast.emit("ping", "You connected");
    localStorage.clear();
    socket.on('lock', function (data) {
        console.log(data);
        var listDevice = localStorage.getItem('devices');
        var listDeviceObject = JSON.parse(listDevice);
        console.log(listDeviceObject.deviceName);
        io.sockets.emit('lock', listDevice);
    });

    socket.on('unlock', function (data) {
        console.log(data);
        io.sockets.emit('unlock', data);
    });

    socket.on("deviceId", function(data){
        console.log(data.id);
        var deviceId = data.id;
        if(!storage.isExistDevice(deviceId)){
            console.log("Add new device");
            storage.addDeviceToStore(data, io);
        }
    });
});
//Khởi tạo 1 server listen tại 1 port
server.listen(PORT);
console.log('Welcome to server: '+ PORT);



