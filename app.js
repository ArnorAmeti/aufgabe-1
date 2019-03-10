let express = require('express');
let im = require('imagemagick');
let gm = require("gm").subClass({
    imageMagick: true
});
let multer  = require('multer');

let app = express();

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({storage: storage}).single('avatar');
app.use(express.static('./public/uploads'));

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

        gm(req.file.path)
            .resize('720')
            .noProfile()
            .write(__dirname + '/public/uploads/small_' + req.file.filename, function (err) {
                if (!err) console.log('done');
            });
        // resizeImage(req);
        res.json({
            success: true,
            message: 'Image uploaded'
        });
    })
})

function resizeImage(req) {
    gm(req.file.path)
        .resize('720')
        .noProfile()
        .write(__dirname + '/public/uploads/small_' + req.file.filename, function (err) {
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



app.listen(process.env.PORT || 4000, function(){
    console.log('Your node js server is running');
});