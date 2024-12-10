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
  try {
    await loadModel(process.env.MODEL_FORM);
    if (!model) {
      return res.status(500).json({ error: 'Model is not loaded yet' });
    }

    const {
      gender,
      age,
      sleepDuration,
      physicalActivityLevel,
      stressLevel,
      bmiCategory,
      heartRate,
      dailySteps,
      sleepDisorder,
    } = req.body;

    if (
      gender === undefined ||
      age === undefined ||
      sleepDuration === undefined ||
      physicalActivityLevel === undefined ||
      stressLevel === undefined ||
      bmiCategory === undefined ||
      heartRate === undefined ||
      dailySteps === undefined ||
      sleepDisorder === undefined
    ) {
      return res.status(400).json({ error: 'Missing required input fields' });
    }

    // Preprocessing example: Map input to numerical values
    const inputData = [
      gender === 'Male' ? 1 : 0, // Map gender to numerical values
      age,
      sleepDuration,
      physicalActivityLevel,
      stressLevel,
      bmiCategory === 'Normal Weight'
        ? 0
        : bmiCategory === 'Overweight'
        ? 1
        : 2, // Map BMI categories
      heartRate,
      dailySteps,
      sleepDisorder === 'None'
        ? 0
        : sleepDisorder === 'Sleep Apnea'
        ? 1
        : 2, // Map sleep disorders
    ];

    // Predict using the model
    const inputTensor = tf.tensor2d([inputData]);
    const prediction = model.predict(inputTensor);
    const predictionArray = prediction.arraySync()[0];

    res.status(200).json({
      prediction: predictionArray,
      message: 'Prediction generated successfully',
    });
  } catch (error) {
    console.error('Error in prediction handler:', error);
    res.status(500).json({ error: 'An error occurred during prediction' });
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
