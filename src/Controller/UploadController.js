const upload = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // observation details
        const { species, year, month, day, location, comment } = req.body;

        return res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            fileName: file.originalname,
            mimeType: file.mimetype,
            fileSize: file.size,
            species,
            year,
            month,
            day,
            location,
            comment
        });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {upload};