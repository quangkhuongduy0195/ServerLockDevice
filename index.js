var path = require("path");
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const PORT = process.env.PORT || 3000;
var devices = [];
//Tạo socket 
io.on('connection', function (socket) {
    console.log('Welcome to server: '+ PORT);

    socket.broadcast.emit("connected", "You connected");

    socket.on('lock', function (data) {
        console.log(data);
        io.sockets.emit('lock', data);
    });

    socket.on("deviceId", function(data){
        // Decode id
        console.log(data);
    });
});
//Khởi tạo 1 server listen tại 1 port
server.listen(PORT);