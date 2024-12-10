const tf = require("@tensorflow/tfjs-node");

async function loadModel(req, res) {
  const model = tf.loadLayersModel("https://storage.googleapis.com/coba-capstone-model/model/model-form/model.json");
  console.log(model);
  return res.json({ message: model})
}

module.exports = loadModel;
