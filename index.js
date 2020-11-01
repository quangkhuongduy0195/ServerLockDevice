var path = require("path");
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var { LocalStorage } = require('node-localstorage');
const { Console } = require("console");
const PORT = process.env.PORT || 3000;
var localStorage = new LocalStorage('./device');
var clientConnects = 0;
var storage = require('./stores/local');
var keys = require('./common/keys');
//Tạo socket 
io.on('connection', function (socket) {
    clientConnects++;
    console.log('Welcome to server: ' + clientConnects);
    socket.broadcast.emit("ping", "You connected");
    // ------------------------------------------------------------------------------------------------------------------
    // Lock the device
    socket.on(keys.socket.on.lock, function (dt) {
        try {
            var data = JSON.parse(dt);
            var deviceId = data.id;
            if (!storage.isLock(deviceId)) {
                storage.addLock(deviceId);
            }
            var isLock = {
                lock: storage.isLock(deviceId),
                deviceId: deviceId,
                message: data.message
            };
            console.log(isLock);
            io.sockets.emit(keys.socket.emit.lockDevice, isLock)
        } catch (ex) {
            console.log(ex.message)
        }
    });

    // ------------------------------------------------------------------------------------------------------------------
    // Check the device is locked
    socket.on(keys.socket.on.isLock, function (dt) {
        try {
            var data = JSON.parse(dt);
            var deviceId = data.id;
            var isLock = {
                lock: storage.isLock(deviceId),
                deviceId: deviceId,
                message: ""
            };
            socket.emit(keys.socket.emit.isLock, isLock)
        } catch (ex) {
            console.log(ex.message)
        }
    });

    // ------------------------------------------------------------------------------------------------------------------
    // Unlock the device
    socket.on(keys.socket.on.unlock, function (dt) {
        try {
            var data = JSON.parse(dt);
            var deviceId = data.id;
            if (storage.isLock(deviceId)) {
                storage.unLock(deviceId);
            }
            var unLock = {
                lock: storage.isLock(deviceId),
                deviceId: deviceId
            };
            io.sockets.emit(keys.socket.emit.unlockDevice, unLock)
        } catch (ex) {
            console.log(ex.message)
        }
    });

    // ------------------------------------------------------------------------------------------------------------------
    // Add device if new device else return
    socket.on(keys.socket.on.deviceInfo, function (dt) {
        try {
            var data = JSON.parse(dt);
            console.log(data.id);
            var deviceId = data.id;
            if (!storage.isExistDevice(deviceId)) {
                console.log("Add new device");
                storage.addDeviceToStore(data, io);
            }
        } catch (ex) {
            console.log(ex.message)
        }
    });

    socket.on(keys.socket.on.devices, function (dt) {
        try {
            var devices =  storage.devices();
            console.log("devices: " + devices);
            socket.emit(keys.socket.emit.devices, devices);
        } catch (ex) {
            console.log(ex.message)
        }
    });

});
//Khởi tạo 1 server listen tại 1 port
server.listen(PORT);
console.log('Welcome to server: ' + PORT);



