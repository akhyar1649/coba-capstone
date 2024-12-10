const tf = require("@tensorflow/tfjs-node");
const loadModel = require("../services/load-model");

async function predictForm(req, res) {
  try {
    // Load model
    const model = loadModel();
    if (!model) {
      return res.status(500).send({ error: "Model belum dimuat" });
    }
    console.log("Model loaded");

    // Ambil data input dari body request
    const { inputData } = req.body;

    // Ambil input shape dari model
    const inputShape = model.inputs[0].shape.slice(1);
    console.log("Model Input Shape:", inputShape);

    // Validasi input data
    if (!Array.isArray(inputData) || inputData.length !== inputShape[0]) {
      return res.status(400).send({ error: "Invalid input data shape" });
    }

    // Konversi ke tensor dengan dimensi batch
    const inputTensor = tf.tensor2d([inputData]); // Dimensi [1, inputShape[0]]
    console.log("Input Tensor Shape:", inputTensor.shape);

    // Lakukan prediksi
    const prediction = model.predict(inputTensor);
    const result = prediction.arraySync()[0]; // Konversi hasil prediksi ke array

    // Kirim hasil prediksi ke client
    res.json({ prediction: result });
  } catch (error) {
    console.error("Error during prediction:", error);
    res.status(500).send({ error: "Internal server error" });
  }
}

module.exports = { predictForm };
