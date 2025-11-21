const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

require('dotenv').config()

const Track = require('../models/Track')
const connectDB = require('../config/db')

const MEDIA_DIR = process.env.MEDIA_DIR || path.join(__dirname,'..','media')

// console.log('Checking directory:', MEDIA_DIR);

async function seed() {
  await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/musicdb');

  // await Track.deleteMany({}); 
  // console.log('Cleared existing tracks.');

  const files = fs.readdirSync(MEDIA_DIR).filter(f => /\.(mp3|ogg|m4a|wav)$/i.test(f));
  console.log('Found media files:', files);

  for (const filename of files) {
    const exists = await Track.findOne({ filename }).lean();
    if (exists) {
      console.log('Skipping existing:', filename);
      continue;
    }
    
    const title = filename.replace(/\.[^/.]+$/, '');
    const newTrack = new Track({
      title,
      artist: 'Unknown Artist',
      filename,
      mimeType: 'audio/mpeg'
    });
    await newTrack.save();
    console.log('Inserted:', filename);
  }
  console.log('Seeding done.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed with error:', err.message || err);
  process.exit(1);
});


