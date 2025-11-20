const express = require('express')
const router = express.Router()

router.get('/', (req,res)=>{
    res.json({
        msg: 'tracks list placeholder'
    })
})
router.get('/:id/stream', (req,res)=>{
    res.status(501).json({
        msg: 'not implemented'
    })
})

module.exports=router