const tf = require('@tensorflow/tfjs-node');
let model;

const loadModel = async () => {
    const loadedModel = await tf.loadLayersModel(process.env.MODEL_FORM);
    if (!loadedModel.inputs || loadedModel.inputs.length === 0) {
        const inputLayer = tf.input({ shape: [9] });
        const output = loadedModel.apply(inputLayer);
        model = tf.model({ inputs: inputLayer, outputs: output });
    } else {
        model = loadedModel;
    }
};

const predict = (inputData) => {
    if (!model) throw new Error('Model is not loaded.');
    const inputTensor = tf.tensor2d([inputData], [1, 9]);
    return model.predict(inputTensor).arraySync();
};

module.exports = { loadModel, predict };
