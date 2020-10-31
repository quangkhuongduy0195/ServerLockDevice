const emit = {
    addDevice : "addDevice",
    lockDevice : "lockDevice",
    unlockDevice : "unlockDevice",
    removeDevice : "removeDevice",
    isLock : "isLock",
    lockDevice : "lockDevice",
}

const storage = {
    devices : 'devices',
    lock : 'lock',
}

const on = {
    deviceInfo : 'deviceInfo',
    lock : 'lock',
    unlock : "unlock",
    isLock : "isLock"
}

module.exports =  {
    socket : {emit : emit, on : on},
    storage :storage
}