const tf = require("@tensorflow/tfjs-node");
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

    // Check if file exists
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded. Please upload an image." });
    }

    // Resize and normalize image using Sharp
    const imageBuffer = await sharp(req.file.buffer)
      .resize(150, 150) // Resize image to 150x150
      .toBuffer();

    // Convert image buffer to tensor
    const inputTensor = tf.tidy(() => {
      const uint8Array = new Uint8Array(imageBuffer);
      const tensor = tf.node.decodeImage(uint8Array, 3); // Decode to 3-channel RGB
      return tensor.div(255.0).expandDims(0); // Normalize and add batch dimension
    });

    // Predict using the model
    const prediction = model.predict(inputTensor);
    const predictionResult = prediction.dataSync(); // Get prediction results as array

    // Clean up tensor
    inputTensor.dispose();

    // Return the prediction
    res.json({ prediction: predictionResult[0] });
  } catch (error) {
    console.error("Error during prediction:", error);
    res.status(500).json({ error: "An error occurred during prediction" });
  }
};

module.exports = { predictForm, predictImage };
