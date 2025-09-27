const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({ region: "ap-southeast-2" });
const bucketName = "n10820566-cloubirding"; 

// Upload file to S3
async function uploadFileToS3(file) {
    const params = {
        Bucket: bucketName,
        Key: file.originalname, 
        Body: file.buffer, 
        ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    return file.originalname; // return filename to frontend
}

// generate Pre-signed URL
async function generatePresignedURL(key) {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
}

module.exports = { uploadFileToS3, generatePresignedURL };

const { PutBucketTaggingCommand } = require("@aws-sdk/client-s3");

async function tagBucket() {
    const command = new PutBucketTaggingCommand({
        Bucket: bucketName,
        Tagging: {
            TagSet: [
                { Key: "qut-username", Value: "n10820566@qut.edu.au" },
                { Key: "purpose", Value: "assignment1" }
            ]
        }
    });
    await s3Client.send(command);
    console.log("✅ Bucket tagged successfully");
}
