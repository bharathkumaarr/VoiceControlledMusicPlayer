const mongoose = require('mongoose')

const TrackSchema = new mongoose.Schema({
    title: {type: String, required: true, index: true},
    artist: {type: String, default: 'Unknown', index: true},
    album: {type: String, default: ''},
    duration: {type: Number, default: 0},
    filename: {type: String, required: true},
    mimeType: {type: String, default: 'audio/mpeg'},
    tags: {type: [String], default: []},
    createdAt: {
        type: Date, default: Date.now
    },

})


module.exports = mongoose.model('Track', TrackSchema)