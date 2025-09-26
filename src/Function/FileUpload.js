const multer = require('multer');
const path = require('path');

// File filter for allowed file types
const fileFilter = (req, file, callBack) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.webm'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
        return callBack(new Error('Unsupported file extension'));
    }
    callBack(null, true);
};

const uploadFile = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: {
        fileSize: 2000 * 1024 * 1024, // 2GB
        files: 1
    }
})

const uploadSingleFile = uploadFile.single('file');

const handleFileUpload = (req, res, next) => {
    uploadSingleFile(req, res, (err) => {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File is too large. Maximum file size is 2GB.' });
        }
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

module.exports = { handleFileUpload };