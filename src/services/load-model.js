const tf = require("@tensorflow/tfjs-node");

async function loadModel() {
  return tf.loadLayersModel("https://storage.googleapis.com/coba-capstone-model/model/model-form/model.json");
}

module.exports = loadModel;
