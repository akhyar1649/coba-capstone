const storage = require("../config/storage.js");
const path = require("path");
require("dotenv").config();

const bucketName = process.env.GCS_BUCKET_NAME; // Nama bucket dari environment variable
const fileName = process.env.GCS_MODEL_NAME;

// Function to get file metadata for version retrieval
async function getFileMetadata() {
  try {
    const file = storage.bucket(bucketName).file(fileName);
    const [metadata] = await file.getMetadata();
    return metadata;
  } catch (error) {
    console.error("Error retrieving file metadata:", error);
    return null;
  }
}

// Route to get the version of the file
async function getVersion(req, res) {
  try {
    const metadata = await getFileMetadata();
    if (!metadata) {
      return res.status(404).json({ message: "File metadata not found" });
    }

    const generation = metadata.generation || "unknown";
    res.status(200).json({
      message: "File version retrieved successfully",
      generation,
    });
  } catch (error) {
    console.error("Error retrieving file version:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Route to download the file
async function getFile(req, res) {
  try {
    const file = storage.bucket(bucketName).file(fileName);
    const exists = await file.exists();

    if (!exists[0]) {
      return res.status(404).json({ message: "File not found" });
    }

    const tempFilePath = path.join(__dirname, "../../temp", fileName);

    await file.download({ destination: tempFilePath });

    res.download(tempFilePath, fileName, (err) => {
      if (err) {
        console.error("Error during file download:", err);
        return res.status(500).json({ message: "Error downloading file" });
      }
    });
  } catch (err) {
    console.error("Error in file download route:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

const getFiles = (fileName) => bucket.file(fileName);

async function downloadModel (req, res) {
  const { fileName } = req.params;
  try {
    const fileExists = await getFileMetadata(fileName);
    if (!fileExists) {
      return res.status(404).send({ message: "File not found" });
    }

    const file = getFiles(fileName);
    const downloadStream = file.createReadStream();

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error.message);
    res.status(500).send({ message: "Error downloading file" });
  }
};

module.exports = {
  getFile,
  getVersion,
  downloadModel,
};
