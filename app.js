let express = require('express');
let cors = require('cors');
let im = require('imagemagick');
let gm = require("gm");
let multer  = require('multer');
let fs = require('fs');


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

app.use(cors());


app.get('/api/files', function (req, res) {
    let files = fs.readdirSync('./public/uploads');
    res.json({
        files
    });
});

app.post('/api/files/optimize', function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            res.json({
                success: false,
                message: err
            });
        } else if (err) {
            console.log(err);
            res.json({
                success: false,
                message: err
            });
        }

        console.log("req.file.path" + req.file.path);

        resizeImages(req);
        res.json({
            success: true,
            message: 'Image uploaded'
        });
    })
});

app.post('/api/files/multiple/optimize', function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            res.json({
                success: false,
                message: err
            });
        } else if (err) {
            console.log(err);
            res.json({
                success: false,
                message: err
            });
        }

        console.log("req.file.path" + req.file.path);

        resizeImages(req);
        res.json({
            success: true,
            message: 'Image uploaded'
        });
    })
});

function resizeImages(req) {

    gm(req.file.path)
        .resize('720')
        .write(__dirname + '/public/uploads/small_' + req.file.filename, function (err) {
            console.log(err);
            if (!err) console.log('done');
        });

    gm(req.file.path)
        .resize('1280')
        .write(__dirname + '/public/uploads/medium_' + req.file.filename, function (err) {
            console.log(err);
            if (!err) console.log('done');
        });

    gm(req.file.path)
        .resize('2044')
        .write(__dirname + '/public/uploads/big_' + req.file.filename, function (err) {
            console.log(err);
            if (!err) console.log('done');
        });
}


app.listen(process.env.PORT || 4000, function(){
    console.log('Your node js server is running');
});