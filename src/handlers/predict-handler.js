const tf = require("@tensorflow/tfjs-node");
const { format } = require('date-fns');
const loadModel = require("../services/load-model");
const { db, bucket } = require("../services/firebase");

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
    const { id } = req.user;
    console.log(`User UID: ${id}`);
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
    const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm-ss');
    const imageName = `${id}-${timestamp}`;

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
    console.log("Tensor disposed.");

    const file = bucket.file(imageName);
    console.log("Uploading image to bucket...");
    await file.save(imageBuffer, { contentType: req.file.mimetype });
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${imageName}`;
    console.log(`Image uploaded: ${imageUrl}`);

    const historyRef = db
      .collection('users')
      .doc(id)
      .collection('history')
      .doc(timestamp);

    console.log("Saving history to Firestore...");

    await historyRef.set({
      imageUrl,
      prediction: prediction[0],
      createdAt: db.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      message: "Prediction generated successfully",
      prediction: predictionResult[0],
      imageUrl,
    });
  } catch (error) {
    console.error("Error during prediction:", error);
    res.status(500).json({ error: "An error occurred during prediction" });
  }
};

module.exports = { predictForm, predictImage };
