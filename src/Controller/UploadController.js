const { uploadFileToS3, generatePresignedURL } = require("../Function/S3");

const upload = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const fileName = await uploadFileToS3(file);

        // generate pre-signed URL
        const fileURL = await generatePresignedURL(fileName);

        return res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            fileName,
            fileURL, 
            mimeType: file.mimetype,
            fileSize: file.size,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { upload };
