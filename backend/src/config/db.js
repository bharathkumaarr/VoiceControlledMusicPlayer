const mongoose = require('mongoose')

async function connectDB(mongoUri) {
    try {

        await mongoose.connect(mongoUri)
        console.log('mongo db connected')
    } catch(err) {
        console.error('mongo db connection error:', err)
        process.exits(1)

    }
}
module.exports = connectDB