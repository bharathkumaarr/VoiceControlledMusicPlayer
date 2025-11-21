const path = require('path')
const Track = require('../models/Track')
const {streamAudio} = require('../services/streamService')

const MEDIA_DIR = process.env.MEDIA_DIR || path.join(__dirname, '..','media');


async function listTracks(req,res,next) { 
    try{
        const page = Math.max(1,parseInt(req.query.page || '1', 10))
        const limit = Math.min(100, parseInt(req.query.limit || '50',10))
        const skip = (page-1)*limit

        const [items,total] = await promise.all([
            Track.find().sort({createdAt:-1}).skip(skip).limit(limit).lean(), Track.countDocuments()
        ])
        res.json({items, total, page, limit})

    } catch (err) {
        next(err)

    }

}

async function getTrack(req,res,next) {
    try{
        const t = await Track.findById(req.params.id).lean();
        if (!t) return res.status(404).json({error:"Track not found"})
        res.json(t)

    } catch (err) {
        next(err)

    }

}

async function streamTrack(req,res,next) {
    try{
        const track = await Track.findById(req.params.id).lean();
        if (!track) return res.status(404).json({error: "Track not found"})

        const filePath = path.isAbsolute(track.filename)
        ? track.filename
        : path.join(process.cwd(), MEDIA_DIR, track.filename)

        await streamAudio(req,res,filePath, track.mimeType || 'audio/mpeg');

    } catch (err) {
        next(err)

    }

}

async function searchTrack(req,res,next) {
    try{
        const q= (req.query.q || '').trim()
        if (!q) return res.json({items:[]});

        const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        const items = await Track.find({
            $or: [{ title: regex }, { artist: regex }, { album: regex }]
        }).limit(20).lean();

        res.json({ items });
        
    } catch (err) {
        next(err)
    }
}

module.exports = {listTracks, getTrack, streamTrack, searchTrack}