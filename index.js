var path = require("path");
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var { LocalStorage } = require('node-localstorage');
const { Console } = require("console");
const PORT = process.env.PORT || 3000;
var localStorage = new LocalStorage('./device');
var storage = require('./stores/local');
var keys = require('./common/keys');
// localStorage.clear();
var clientConnects = 0;
var codeUnlock = "111111";

//Tạo socket 
io.on('connection', function (socket) {
    socket.on('disconnect', function() {
        if (clientConnects > 0)
            clientConnects--;
        console.log('Welcome to server: ' + clientConnects);
    });
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
                id: deviceId,
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
                id: deviceId,
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
                id: deviceId
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

    socket.on(keys.socket.on.codeUnlock, function (dt) {
        try {
            var data = JSON.parse(dt);
            console.log(data.codeUnlock);
            if(codeUnlock == data.codeUnlock){
                storage.unLock(data.id);
                if(!storage.isLock(data.id)){
                    var unLock = {
                        lock: false,
                        id: data.id
                    };
                    io.sockets.emit(keys.socket.emit.unlockDevice, unLock)
                }
            }
        } catch (ex) {
            console.log(ex.message)
        }
    });

});
//Khởi tạo 1 server listen tại 1 port
server.listen(PORT);
console.log('Welcome to server: ' + PORT);



