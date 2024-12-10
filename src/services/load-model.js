const tf = require("@tensorflow/tfjs-node");

async function loadModel() {
  return tf.loadLayersModel();
}

module.exports = loadModel;
