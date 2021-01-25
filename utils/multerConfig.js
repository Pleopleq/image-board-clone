const multer = require('multer')

const fileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
        return cb(new Error("File must be JPG or PNG."))
    }
    cb(undefined, true) 
}


const upload = multer({
    limits: {
        fileSize: 1024 * 1024 * 3
    },
    fileFilter: fileFilter
})


module.exports = upload