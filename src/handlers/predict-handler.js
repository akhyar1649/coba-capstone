const tf = require("@tensorflow/tfjs-node");

// Handler untuk prediksi
async function predictForm(req, res) {
  const inputData = req.body;

  // Pastikan input sesuai dengan format yang diinginkan
  const features = [
    inputData.age,
    inputData.sleep_duration,
    inputData.physical_activity_level,
    inputData.stress_level,
    inputData.bmi_category,
    inputData.heart_rate,
    inputData.daily_steps,
    inputData.sleep_disorder,
  ];

  // Mengubah input menjadi tensor
  const inputTensor = tfnode.tensor([features]);

  // Lakukan prediksi
  try {
    const predictions = model.predict(inputTensor);
    const result = predictions.arraySync();

    res.json({ prediction: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error predicting data");
  }
}

module.exports = { predictForm };
