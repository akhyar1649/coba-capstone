const tf = require("@tensorflow/tfjs-node");
const loadModel = require("../services/load-model");

// Fungsi untuk menangani prediksi
const predictForm = async (req, res) => {
  try {
    const model = await loadModel(process.env.MODEL_FORM);
    if (!model) {
      return res
        .status(500)
        .json({ error: "Model is not loaded yet. Please try again later." });
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
      return res.status(400).json({ error: "Missing required input fields" });
    }

    const inputData = [
      gender === "Male" ? 1 : 0,
      age,
      sleepDuration,
      physicalActivityLevel,
      stressLevel,
      bmiCategory === "Normal Weight"
        ? 0
        : bmiCategory === "Overweight"
        ? 1
        : 2,
      heartRate,
      dailySteps,
      sleepDisorder === "None" ? 0 : sleepDisorder === "Sleep Apnea" ? 1 : 2,
    ];

    const inputTensor = tf.tensor2d([inputData]);
    const prediction = model.predict(inputTensor);
    const predictionArray = prediction.arraySync()[0];

    res.status(200).json({
      message: "Prediction generated successfully",
      prediction: predictionArray,
    });
  } catch (error) {
    console.error("Error in prediction handler:", error);
    res.status(500).json({ error: "An error occurred during prediction" });
  }
};

const predictImage = async (req, res) => {
  try {
    const model = await loadModel(process.env.MODEL_IMAGE);
    if (!model) {
      return res.status(500).json({ error: "Model not loaded yet" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded. Please upload an image." });
    }

    const imageBuffer = req.file.buffer;
    const tensor = tf.tidy(() => {
      return tf.node
        .decodeImage(imageBuffer)
        .resizeNearestNeighbor([150, 150])
        .toFloat()
        .expandDims(0);
    });

    const prediction = model.predict(tensor);
    const predictionResult = prediction.dataSync();

    tensor.dispose();

    res.json({
      message: "Prediction generated successfully",
      prediction: predictionResult[0],
    });
  } catch (error) {
    console.error("Error during prediction:", error);
    res.status(500).json({ error: "An error occurred during prediction" });
  }
};

module.exports = { predictForm, predictImage };
