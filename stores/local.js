var { LocalStorage } = require('node-localstorage');
var localStorage = new LocalStorage('./device');

function addDeviceToStore(deviceInfo, io) {
    var listDevices = JSON.parse(localStorage.getItem('devices'));
    console.log(listDevices);
    var listDevice = [];
    if (listDevices != null) {
        listDevice = listDevices.devices;
    }
    listDevice.push(deviceInfo);
    var devices = {
        devices: listDevice
    }
    localStorage.setItem('devices', JSON.stringify(devices));
    listDevices = JSON.parse(localStorage.getItem('devices'));
    console.log(listDevices)
    io.sockets.emit('addDevice', listDevices);
}

function isExistDevice(deviceId) {
    var listDevices = JSON.parse(localStorage.getItem('devices'));
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
        var listDeviceLocks = JSON.parse(localStorage.getItem('lock'));
        if (listDeviceLocks != null) {
            for (const device of listDeviceLocks.deivces) {
                if (device.id === deviceId) {
                    return true;
                }
            }
            return false;
        } else
            return false;
    } else
        return false;
}
function addLock(deviceId) {
    var listDeviceLocks = JSON.parse(localStorage.getItem('lock'));
    var locks = [];
    if (listDeviceLocks != null) {
        locks = listDeviceLocks.devices;
    }
    locks.push(deviceId);
    var devices = {
        devices: listDevice
    }
    localStorage.setItem('lock', JSON.stringify(devices));
    listDeviceLocks = JSON.parse(localStorage.getItem('lock'));
    console.log(listDeviceLocks)
    io.sockets.emit('lockDevice', listDeviceLocks);
}

module.exports = {
    addDeviceToStore: addDeviceToStore,
    isExistDevice: isExistDevice
}