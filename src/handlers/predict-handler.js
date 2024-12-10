const tf = require('@tensorflow/tfjs-node');

// Load model di awal
let model;
(async () => {
    model = await tf.loadLayersModel("https://storage.googleapis.com/coba-capstone-model/model/model-form/model.json");
    console.log('Model loaded successfully.');
})();

// Handler untuk prediksi
const predictForm = async (req, res) => {
    try {
        // Validasi input
        const inputData = req.body.input; // Expect an array of arrays
        if (!Array.isArray(inputData) || !Array.isArray(inputData[0])) {
            return res.status(400).json({ error: 'Invalid input format. Expected an array of arrays.' });
        }

        // Convert input ke tensor
        const inputTensor = tf.tensor(inputData);

        // Prediksi menggunakan model
        const prediction = model.predict(inputTensor);

        // Convert output tensor ke array
        const output = prediction.arraySync();

        res.status(200).json({ prediction: output });
    } catch (error) {
        console.error('Error in prediction:', error);
        res.status(500).json({ error: 'Prediction failed.' });
    }
};

module.exports = { predictForm };
