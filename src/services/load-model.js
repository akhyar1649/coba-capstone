const tf = require("@tensorflow/tfjs-node");

async function loadModel(model) {
  return tf.loadLayersModel(model);
}

module.exports = loadModel;
