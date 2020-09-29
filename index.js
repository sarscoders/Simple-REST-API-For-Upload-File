const express = require('express');         
var bodyParser = require('body-parser');
const busboy = require('connect-busboy');   
const path = require('path');               
const fs = require('fs-extra');             
const app = express();
app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, 
})); 
const uploadPath = path.join(__dirname, 'upload/'); 
fs.ensureDir(uploadPath); 
/**
 * Create route /upload which handles the post request
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.route('/upload').post((req, res, next) => {
    req.pipe(req.busboy); 
    req.busboy.on('file', (fieldname, file, filename) => {
        
        console.log(`Upload of '${filename}' started`);
       
        const fstream = fs.createWriteStream(path.join(uploadPath, filename));
    
        file.pipe(fstream);
     
        fstream.on('close', () => {
            console.log(`Upload of '${filename}' finished`);
            res.send('File uploaded');
        });
    });
});
const server = app.listen(3200, function () {
    console.log(`Listening on port ${server.address().port}`);
});
