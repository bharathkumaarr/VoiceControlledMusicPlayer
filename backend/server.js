require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./src/config/db')


const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/tracks', require('./src/routes/tracks.routes'));
app.get('/api/health', (req,res)=>{
    res.json({ok: true})
})

const PORT = process.env.PORT || 3000


connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/musicdb')
app.listen(PORT, ()=>{console.log(`backend running on ${PORT}`)})

