const tf = require("@tensorflow/tfjs-node");
const loadModel = require("../services/load-model");

async function predictForm(req, res) {
  try {
    // Load model
    const model = await loadModel(process.env.MODEL_FORM);
    if (!model) {
      return res.status(500).send({ error: "Model belum dimuat" });
    }

    // Ambil data input
    const inputData = req.body;

    // Validasi data input
    const inputShape = model.inputs[0].shape.slice(1); // Ambil shape input
    if (!Array.isArray(inputData) || inputData.length !== inputShape[0]) {
      return res.status(400).send({ error: "Invalid input data shape" });
    }

    // Konversi ke tensor
    const inputTensor = tf.tensor([inputData], [1, inputData.length]);

    // Prediksi
    const prediction = model.predict(inputTensor);
    const result = prediction.arraySync()[0]; // Ambil prediksi sebagai array

    // Kirim hasil prediksi
    res.json({ prediction: result });
  } catch (error) {
    console.error("Error during prediction:", error);
    res.status(500).send({ error: "Internal server error" });
  }
}

module.exports = { predictForm };
