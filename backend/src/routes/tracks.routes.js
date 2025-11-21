const express = require('express')
const router = express.Router()
const trackController = require('../controllers/trackController')

router.get('/', trackController.listTracks)
router.get('/stream', trackController.searchTrack)
router.get('/:id', trackController.getTrack)
router.get('/:id/stream', trackController.streamTrack)



module.exports=router