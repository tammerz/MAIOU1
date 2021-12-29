const express = require('express');
const socket = require("socket.io");
const bodyparser = require('body-parser');
const models = require('./utils/models.js');

const PORT = process.env.PORT || 80;
const actionLifespanMs = 120000; // 2 min
// const actionLifespanMs = 30;
let productRooms = {};

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Server setup
const server = app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

// Socket.io setup
const io = socket(server);

// Reusable function to delete queued actions that are already done & older than the by "actionLifespanMs" defined milliseconds.
const clearOldActionsFromProduct = (productId) => {
    const currentTime = Date.now();
    for (const [key, value] of Object.entries(productRooms[productId].actionsQueue)) {
        if (value.done && (value.time + actionLifespanMs) < currentTime) {
            delete productRooms[productId].actionsQueue[key];
            console.log('deleted ', key);
        }
    }
}

// Parameters

//// Control for the "productId"-parameter that will be used in most routes.
app.param('productId', (req, res, next, productId) => {
    if (parseInt(productId, 10)) {
        req.productId = parseInt(productId, 10);
        next();
    } else {
        res.json({ success: false, error: "Invalid id." });
    }
});


// Routes

//// Get stored data from product via productId
app.get('/:productId', (req, res) => {
    if (req.productId in productRooms) {
        res.json({
            success: true,
            value: productRooms[req.productId]
        });
    } else {
        res.json({ success: false });
    }
});

//// Queue an action for a product by productId. Only if it's an allowed action. Responds with the actions timespan.
app.post('/:action/:productId', (req, res) => {
    const possibleActions = ['tare', 'resetToInit', 'calibrationStepOne', 'calibrationStepTwo'];
    if (possibleActions.includes(req.params.action) && (req.productId in productRooms)) {
        clearOldActionsFromProduct(req.productId);
        const action = models.productActionModel(req.params.action, req.body);
        productRooms[req.productId].actionsQueue[action.time] = action;
        res.json({
            success: true,
            value: productRooms[req.productId],
            time: action.time
        });
    } else {
        res.json({ success: false });
    }
});

//// Delete a queued action from productRooms with actionTimestamp as index.
app.post('/delete/:productId/:actionTimestamp', (req, res) => {
    if (req.productId in productRooms && req.params.actionTimestamp in productRooms[req.productId].actionsQueue) {
        delete productRooms[req.productId].actionsQueue[req.params.actionTimestamp];
        console.log('Deleted ' + req.params.actionTimestamp);
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});


// Socket.io connection

//// Listen connections from product clients.
io.on("connection", (socket) => {
    console.log("Socket connection with Client established");

    socket.on('join', (productId, callback) => {
        // Add the client to his room. We do this only to instance the productId to this connection.
        socket.join(productId);
        console.log("Client moved to room " + productId);

        // Create productRooms entry current productId OR update existing state.
        if (!(productId in productRooms)) {
            let product = models.productRoomModel(productId);
            product.connected = true;
            productRooms[productId] = product;
        } else {
            productRooms[productId].connected = true;
        }
        console.log("Initial productRooms[" + productId + "]:", JSON.stringify(productRooms[productId]));

        // Call the callback-function if the client has given one.
        if (callback !== undefined) {
            callback();
        }


        // Listen for "weightData"-event emitted from the Client.
        socket.on('weightData', (data) => {
            // Save product data.
            productRooms[productId].weight = data.value;
            productRooms[productId].scale = data.scale;
            productRooms[productId].offset = data.offset;

            // Check for queued actions for current productId and emit those to the client.
            for (const [key, value] of Object.entries(productRooms[productId].actionsQueue)) {
                if (!value.done) {
                    console.log('Sending Action', value.name, 'to', productId);
                    io.in(productId).emit("action", {
                        name: value.name,
                        time: value.time,
                        data: value.data
                    });
                }
            }
        });

        // Listen for "disconnect"-event fired on connection loss.
        socket.on('disconnect', () => {
            productRooms[productId].connected = false;
            console.log('Product (RPI) disconnected from room ' + productId);
        });

        // Listen for "action done"-event emitted from the Client. And update the corresponding product room actions-queue based on given data.
        socket.on('action done', ({ time, productId, result }) => {
            // Find action with the matching timestamp & update the done status.
            productRooms[productId].actionsQueue[time].done = true;
            console.log('action done', productRooms[productId].actionsQueue[time]);

        });

    });

});