const tf = require("@tensorflow/tfjs-node");

// Simulasi model (gunakan model sebenarnya dalam aplikasi nyata)
let model;

// Memuat model TensorFlow.js
const loadModel = async () => {
  if (!model) {
    try {
      model = await tf.loadLayersModel(
        "https://storage.googleapis.com/coba-capstone-model/model/model-form/model.json"
      );
      console.log("Model loaded successfully");
    } catch (error) {
      console.error("Error loading model:", error);
    }
  }
};

// Fungsi untuk menangani prediksi
const handlePrediction = async (req, res) => {
  const { input } = req.body;

  if (!Array.isArray(input) || input[0].length !== 9) {
    return res
      .status(400)
      .json({
        error: "Input must be an array of arrays with 9 features each.",
      });
  }

  try {
    await loadModel();

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

module.exports = { handlePrediction };
