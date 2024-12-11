const { getFileMetadata, getFile } = require("../services/storage-services.js");

async function downloadModel(req, res) {
  const { fileName } = req.params;
  try {
    const fileExists = await getFileMetadata(fileName);
    if (!fileExists) {
      return res.status(404).send({ message: "File not found" });
    }

    const file = getFile(fileName);
    const downloadStream = file.createReadStream();

    res.status(200).setHeader("Content-Disposition", `attachment; filename="${fileName}"`)
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error.message);
    res.status(500).send({ message: "Error downloading file" });
  }
}

module.exports = { downloadModel };
