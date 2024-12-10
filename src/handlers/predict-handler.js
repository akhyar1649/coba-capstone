const tf = require("@tensorflow/tfjs-node");
const loadModel = require("../services/load-model");
const { preprocessInput } = require("../services/preprocessing");

// Handler untuk prediksi
async function predictForm(req, res) {
  const model = await loadModel(process.env.MODEL_FORM);
  try {
    if (!model) {
      return res.status(500).send({ error: "Model belum dimuat" });
    }

    const inputData = req.body;

    // Preprocessing data
    // const processedInput = preprocessInput(inputData);
    // if (!processedInput) {
    //   return res.status(400).send({ error: "Invalid input data" });
    // }

    // Konversi ke tensor
    const inputTensor = tf.tensor2d([inputData]);

    // Prediksi dengan model
    const prediction = model.predict(inputTensor);
    const result = prediction.arraySync()[0]; // Ambil prediksi sebagai array

    // Kirim hasil prediksi
    res.json({ prediction: result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}

module.exports = { predictForm };
