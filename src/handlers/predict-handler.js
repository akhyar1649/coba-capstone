const tf = require("@tensorflow/tfjs-node");
const loadModel = require("../services/load-model");

async function predictForm(req, res) {
  try {
    // Load model
    const model = await loadModel();
  } catch (error) {
    console.error("Model:", error);
    res.status(500).send({ error: "Internal server error" });
  }
}

module.exports = { predictForm };
