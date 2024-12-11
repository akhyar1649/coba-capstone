const tf = require("@tensorflow/tfjs-node");

async function loadModel(path) {
  try {
    const model = tf.loadLayersModel(path);
    console.log("Model loaded successfully");
    return model;
  } catch (error) {
    console.error("Error loading model:", error);
  }
}

module.exports = loadModel;
