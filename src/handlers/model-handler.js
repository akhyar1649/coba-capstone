const { getFileMetadata, getFile } = require("../services/storage.js");
require("dotenv").config();

const fileName = process.env.GCS_MODEL_NAME;

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
async function getFileMe(req, res) {
  try {
    const file = getFile(fileName);
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

async function downloadModel (req, res) {
  const { fileName } = req.params;
  try {
    const fileExists = await getFileMetadata(fileName);
    if (!fileExists) {
      return res.status(404).send({ message: "File not found" });
    }

    const file = getFile(fileName);
    const downloadStream = file.createReadStream();

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error.message);
    res.status(500).send({ message: "Error downloading file" });
  }
};

module.exports = {
  getFileMe,
  getVersion,
  downloadModel,
};
