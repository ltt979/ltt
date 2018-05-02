var path = require("path");
var multer = require('multer');
var crypto = require('crypto');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/uploads"));
    },
    filename: function (req, file, cb) {
        var date = new Date();
        cb(null, getRandomFileName() + '-' + file.originalname);
    }
});

var getRandomFileName = function() {
    return crypto.pseudoRandomBytes(16).toString('hex');
}


var upload = multer({
    storage: storage
});

module.exports = multer({storage: storage})  

// console.log(getRandomFileName());