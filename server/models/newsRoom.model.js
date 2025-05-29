const mongoose = require('mongoose')

const newsRoomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
})

const NewsRoom = mongoose.model('NewsRoom', newsRoomSchema)
module.exports = NewsRoom;