let express = require('express');
let im = require('imagemagick');
let gm = require("gm").subClass({
    imageMagick: true
});
let multer  = require('multer');

let app = express();

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({storage: storage}).single('avatar');

app.post('/', function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.json({
                success: false,
                message: 'error during uploading 1'
            });
        } else if (err) {
            res.json({
                success: false,
                message: 'error during uploading 2'
            });
        }

        resizeImage(req);
        res.json({
            success: true,
            message: 'Image uploaded'
        });
    })
})

function resizeImage(req) {
    gm('./uploads/gulp.png')
        .resize(240, 240)
        .noProfile()
        .write('./uploads/small/test.png', function (err) {
            if (!err) console.log('done');
        });
}

/*
function resizeImage(req) {
    gm(req.file.path)
        .resize(240, 240)
        .noProfile()
        .write('./uploads/small/' + req.file.fieldname + '-' + Date.now(), function (err) {
            if (!err) console.log('done');
      });
}
*/



app.listen(3000);