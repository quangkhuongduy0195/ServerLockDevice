var { LocalStorage } = require('node-localstorage');
var keys = require('../common/keys');
var localStorage = new LocalStorage('./device');

function addDeviceToStore(deviceInfo, io) {
    var listDevices = JSON.parse(localStorage.getItem(keys.storage.devices));
    console.log(listDevices);
    var listDevice = [];
    if (listDevices != null) {
        listDevice = listDevices.devices;
    }
    deviceInfo['isLock'] = false;
    deviceInfo['assign'] = "DuyQK";
    deviceInfo['dateAssign'] = "10/10/2010";
    listDevice.push(deviceInfo);
    var devices = {
        devices: listDevice
    }
    localStorage.setItem(keys.storage.devices, JSON.stringify(devices));
    listDevices = JSON.parse(localStorage.getItem(keys.storage.devices));
    console.log(listDevices)
    io.sockets.emit(keys.socket.emit.addDevice, listDevices);
}

function isExistDevice(deviceId) {
    var listDevices = JSON.parse(localStorage.getItem(keys.storage.devices));
    if (listDevices != null) {
        for (const device of listDevices.devices) {
            if (device.id === deviceId) {
                return true;
            }
        }
        return false;
    }
    else
        return false;

}

function isLock(deviceId) {
    if (isExistDevice(deviceId)) {
        var listDevices = JSON.parse(localStorage.getItem(keys.storage.devices));
        if (listDevices != null) {
            for (const device of listDevices.devices) {
                if (device.id === deviceId) {
                    return device.isLock;
                }
            }
            return false;
        } else
            return false;
    } else
        return false;
}


function addLock(deviceId) {
    var listDevices = JSON.parse(localStorage.getItem(keys.storage.devices));
    if (listDevices != null) {
        var devices = listDevices.devices;
        for (var i in listDevices.devices) {
            if (listDevices.devices[i].id === deviceId) {
                listDevices.devices[i].isLock = true;
            }
        }
        localStorage.setItem(keys.storage.devices, JSON.stringify(listDevices));
    }
}


function unLock(deviceId) {
    var listDevices = JSON.parse(localStorage.getItem(keys.storage.devices));
    var devices = listDevices.devices;
    for (var i in listDevices.devices) {
        if (listDevices.devices[i].id === deviceId) {
            listDevices.devices[i].isLock = false;
        }
    }
    localStorage.setItem(keys.storage.devices, JSON.stringify(listDevices));
}

module.exports = {
    addDeviceToStore: addDeviceToStore,
    isExistDevice: isExistDevice,
    isLock: isLock,
    addLock: addLock,
    unLock: unLock
}