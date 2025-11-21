const path = require('path')
const Track = require('../models/Track')
const {streamAudio} = require('../services/streamService')

const MEDIA_DIR = process.env.MEDIA_DIR || path.join(__dirname, '..','media');


function listTracks(req,res,next) { 
    try{

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

function streamTrack(req,res,next) {
    try{

    } catch (err) {
        next(err)

    }

}

function searchTrack(req,res,next) {
    try{
        

    } catch (err) {
        next(err)
    }
}

module.exports = {listTracks, getTrack, streamTrack, searchTrack}