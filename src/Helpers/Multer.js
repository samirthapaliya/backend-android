const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: ( req, res, cb ) => {
        cb(null, 'src/Uploads/Profile')
    },
    filename: ( req, file, cb ) => {
        cb( null, file.fieldname + '-' + Date.now() + path.extname(file.originalname) )
    }
});


var storageProduct = multer.diskStorage({
    destination: ( req, res, cb ) => {
        cb(null, 'src/Uploads/Products')
    },
    filename: ( req, file, cb ) => {
        cb( null, file.fieldname + '-' + Date.now() + path.extname(file.originalname) )
    }
});


const uploadsProfile = multer({ storage: storage });
const uploadsProduct = multer({ storage: storageProduct });


module.exports = {
    uploadsProfile,
    uploadsProduct
}