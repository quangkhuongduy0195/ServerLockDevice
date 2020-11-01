const emit = {
    addDevice : "addDevice",
    lockDevice : "lockDevice",
    unlockDevice : "unlockDevice",
    removeDevice : "removeDevice",
    isLock : "isLock",
    lockDevice : "lockDevice",
    devices : 'devices',
}

const storage = {
    devices : 'devices',
    lock : 'lock',
}

const on = {
    deviceInfo : 'deviceInfo',
    lock : 'lock',
    unlock : "unlock",
    isLock : "isLock",
    devices : 'devices',
}

module.exports =  {
    socket : {emit : emit, on : on},
    storage :storage
}