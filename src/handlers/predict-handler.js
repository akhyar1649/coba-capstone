const tf = require("@tensorflow/tfjs-node");
const loadModel = require("../services/load-model");
const { preprocessInput } = require("../services/preprocessing");
require("dotenv").config();

// Handler untuk prediksi
async function predictForm(req, res) {
  const model = await loadModel(process.env.MODEL_FORM);

  try {
    if (!model) {
      return res.status(500).json({ error: 'Model is not loaded yet.' });
    }

    const { input } = req.body;

    // Validate input
    if (!input || !Array.isArray(input) || input.some(row => row.length !== 9)) {
      return res.status(400).json({
        error: 'Invalid input. Please provide a 2D array with 9 features per sample.',
      });
    }

    // Create a tensor from input
    const inputTensor = tf.tensor2d(input);

    // Make predictions
    const predictions = model.predict(inputTensor);

    // Convert predictions to a readable format
    const output = predictions.arraySync();

    // Return the predictions
    res.json({ predictions: output });
  } catch (error) {
    console.error('Error during prediction:', error);
    res.status(500).json({ error: 'Failed to process prediction.' });
  }
}

module.exports = { predictForm };
