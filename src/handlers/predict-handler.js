const tf = require("@tensorflow/tfjs-node");
const fs = require('fs');
const sharp = require("sharp");

// Simulasi model (gunakan model sebenarnya dalam aplikasi nyata)
let model;

// Memuat model TensorFlow.js
const loadModel = async (path) => {
  if (!model) {
    try {
      model = await tf.loadLayersModel(path);
      console.log("Model loaded successfully");
    } catch (error) {
      console.error("Error loading model:", error);
    }
  }
};

// Fungsi untuk menangani prediksi
const predictForm = async (req, res) => {
  const { input } = req.body;

  if (!Array.isArray(input) || input[0].length !== 9) {
    return res.status(400).json({
      error: "Input must be an array of arrays with 9 features each.",
    });
  }

  try {
    await loadModel(process.env.MODEL_FORM);

    // Konversi input menjadi tensor
    const inputTensor = tf.tensor(input);

    // Lakukan prediksi
    const prediction = model.predict(inputTensor);

    // Ambil hasil sebagai array
    const predictionArray = prediction.arraySync();

    // Kirimkan respons
    res.json({ prediction: predictionArray });
  } catch (error) {
    console.error("Error during prediction:", error);
    res.status(500).json({ error: "Error during prediction" });
  }
};

const predictImage = async (req, res) => {
  try {
    await loadModel(process.env.MODEL_IMAGE);
    if (!model) {
      return res
        .status(500)
        .json({ error: "Model not loaded yet. Please try again later." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read the uploaded file
    const filePath = req.file.path;
    const imageBuffer = fs.readFileSync(filePath);

    // Decode image and resize
    const tensor = tf.node
      .decodeImage(imageBuffer)
      .resizeNearestNeighbor([150, 150]) // Resize to match model input
      .toFloat()
      .div(255.0) // Normalize to [0, 1]
      .expandDims(0); // Add batch dimension

    // Predict using the model
    const prediction = model.predict(tensor);
    const predictionResult = prediction.dataSync(); // Get prediction results as array

    // Clean up: Remove uploaded file
    fs.unlinkSync(filePath);

    // Return the prediction
    res.json({ prediction: predictionResult[0] });
  } catch (error) {
    console.error("Error during prediction:", error);
    res.status(500).json({ error: "An error occurred during prediction" });
  }
};

module.exports = { predictForm, predictImage };
