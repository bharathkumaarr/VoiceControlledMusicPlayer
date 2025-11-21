const fs = require('fs')
const path = require('path')

async function streamAudio(req,res, filePath, memType = 'audio/mpeg') {
    try {
        const stat = await fs.promises.stat(filePath);
        const fileSize = await stat.size

        const range = req.headers.range;
        if (range) {
            //taking the range from the client, also storing the start and end of the range in the start and end variable
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1],10) : fileSize-1



            //validating start and end
            if (start>=fileSize || end>=fileSize) {
                res.status(416).set('Content-Range', `bytes */${fileSize}`).end();
                return;
            }

            const chunkSize = end-start+1;
            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges':'bytes',
                'Content-Length': chunkSize,
                'Content-Type': mimeType
            })

            const stream = fs.createReadStream(filePath, {start, end});
            stream.pipe(res);
            stream.on('error', err=>{
                console.error('stream error', err)
                res.end();

            })
        } else { //no range presemt in heafder
            res.writeHead(200, {
                'Content-Length': fileSize,
                'Content-Type': mimeType,
                'Accept-Ranges':'bytes' 
            })

            fs.createReadStream(filePath).pipe(res)
        }   
    } catch (err) {
        console.error('streamAudio error', err);
        res.status(404).json({error:'File not found'})
    }
}

module.exports = {streamAudio}