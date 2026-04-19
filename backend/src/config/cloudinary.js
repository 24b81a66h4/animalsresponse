const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('CRITICAL: Cloudinary environment variables are missing! Complaint submissions with media will fail.');
}


const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith('video/');
        return {
            folder: 'animal-rescue/complaints',
            resource_type: isVideo ? 'video' : 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov'],
            transformation: isVideo ? [] : [{ width: 1200, crop: 'limit', quality: 'auto' }],
        };
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only images (jpg, png, webp) and videos (mp4, mov) are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

module.exports = { upload, cloudinary };