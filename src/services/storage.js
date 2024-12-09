require("dotenv").config();
const { Storage } = require("@google-cloud/storage");

const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME;

async function getFileMetadata(fileName) {
  try {
    const file = storage.bucket(bucketName).file(fileName);
    const [metadata] = await file.getMetadata();
    return metadata;
  } catch (error) {
    console.error("Error retrieving file metadata:", error);
    return null;
  }
}

const getFile = (fileName) => storage.bucket(bucketName).file(fileName);

module.exports = { getFileMetadata, getFile };
