const hx711 = require('@ataberkylmz/hx711');
const io = require("socket.io-client");
const config = require("./config.json");

// init
const sensor = new hx711(config.SCK_PIN, config.DT_PIN);
sensor.setScale(config.initialScale);
sensor.setOffset(config.initialOffset);
let sendWeightInterval;

// Writes arguments to console if enabled vie config file.
const log = (...args) => {
    if (config.logToConsole) {
        console.log(...args);
    }
}

// Returns object with weight data.
const readWeight = () => {
    return {
        value: sensor.getUnits(15),
        scale: sensor.getScale(),
        offset: sensor.getOffset()
    };
}

// Tare the scale. Aka. reset the scale to 0. (Example: Exclude the weight of a bowl)
// Also recalculate new Scale factor.
// Then return read data.
const tare = () => {
    const lastScale = sensor.getScale();
    const lastOffset = sensor.getOffset();
    const lastUnits = sensor.getUnits(15);
    sensor.tare();

    // Get an average of 10 read()s
    let sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += sensor.read();
    }
    // Calculate & set the new Scale multiplier
    sensor.setScale((sum / 10 - lastOffset) / lastUnits);
    let result = readWeight();
    result.lastScale = lastScale;
    result.lastOffset = lastOffset;
    return result;
}


// Reset to inital values from the config file.
const resetToInit = () => {
    sensor.setScale(config.initialScale);
    sensor.setOffset(config.initialOffset);
    return readWeight();
}


// Calibration step 1: Place nothing on the scale before calling this.
const calibrationStepOne = () => {
    sensor.tare();
    return readWeight();
}

// Calibration step 2: Place known weight on the scale then call this with the weight in grams.
const calibrationStepTwo = (weight) => {
    const lastOffset = sensor.getOffset();
    let sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += sensor.read();
    }
    sensor.setScale((sum / 10 - lastOffset) / weight);
    return readWeight();
}





// Connect to server via Socket.io-client. (This Client auto reconnects on connection loss)
const socket = io(config.serverURL);

// Join the room for product after establishing a connection.
socket.on('connect', () => {
    log('Connected to server!');
    socket.emit('join', config.productId, () => {
        // Setup interval function to periodically send weight data to server.
        sendWeightInterval = setInterval(() => {
            socket.emit('weightData', readWeight());
        }, config.updateFrequencyInMS);
    });
});


// Clear interval function on disconnect-event to prevent unnecessary errors.
socket.on('disconnect', () => {
    log('Disconnected from server!');
    clearInterval(sendWeightInterval);
});

// All possible actions this Product can react to. Refer to called function inside the "result"-key for explanation.
socket.on('action', ({ name, time, data }) => {
    log('action', { name, time, data });
    switch (name) {
        case 'tare':
            socket.emit('action done', {
                time,
                productId: config.productId,
                result: tare()
            });
            break;

        case 'resetToInit':
            socket.emit('action done', {
                time,
                productId: config.productId,
                result: resetToInit()
            });
            break;

        case 'calibrationStepOne':
            socket.emit('action done', {
                time,
                productId: config.productId,
                result: calibrationStepOne()
            });
            break;

        case 'calibrationStepTwo':
            socket.emit('action done', {
                time,
                productId: config.productId,
                result: calibrationStepTwo(data.weight)
            });
            break;

        default:
            break;
    }
});