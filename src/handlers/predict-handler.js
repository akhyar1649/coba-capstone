const tf = require("@tensorflow/tfjs-node");
const { loadModel, predict } = require("../services/load-model");
const { preprocessInput } = require("../services/preprocessing");

// Handler untuk prediksi
async function predictForm(req, res) {    
    try {
        loadModel();
        const inputData = req.body.inputData; // Pastikan ini adalah array dengan 9 elemen
        const predictions = predict(inputData);
        res.status(200).json({ predictions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { predictForm };
