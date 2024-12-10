const tf = require("@tensorflow/tfjs-node");
const loadModel = require("../services/load-model");
const { preprocessInput } = require("../services/preprocessing");
require("dotenv").config();

// Handler untuk prediksi
async function predictForm(req, res) {
  const model = await loadModel(process.env.MODEL_FORM);

  try {
    if (!model) {
      return res.status(500).send({ error: "Model is not loaded yet." });
    }

    const inputData = req.body;
    const processedInput = preprocessInput(inputData);

    if (!processedInput) {
      return res.status(400).send({ error: "Invalid input data." });
    }

    const inputTensor = tf.tensor2d([processedInput]); // Bentuk [1, 9]
    const prediction = model.predict(inputTensor);
    const result = prediction.arraySync()[0]; // Ambil array hasil prediksi

    res.json({ prediction: result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error." });
  }
}

module.exports = { predictForm };
