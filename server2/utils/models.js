// Returns Initial Object Models
module.exports = {
    productRoomModel: function(productId) {
        return {
            productId,
            connected: false,
            weight: 0,
            scale: 0,
            offset: 0,
            actionsQueue: {}
        }
    },
    productActionModel: function(name, data = null) {
        return {
            name,
            data,
            done: false,
            time: Date.now()
        }
    }
}