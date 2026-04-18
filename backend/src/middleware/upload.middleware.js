const { upload } = require('../config/cloudinary');

const uploadMedia = upload.array('media', 5); // max 5 files

const handleUpload = (req, res, next) => {
    uploadMedia(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

module.exports = { handleUpload };