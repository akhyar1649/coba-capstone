const preprocessInput = (inputData) => {
  // Validasi jumlah fitur input
  if (Object.keys(inputData).length !== 9) {
    console.error("Invalid number of features. Expected 9.");
    return null;
  }

  // Contoh encoding kategori jika diperlukan
  const categoryMapping = {
    Gender: { Male: 0, Female: 1 },
    "BMI Category": { "Normal": 0, "Overweight": 1, "Obese": 2 },
    "Sleep Disorder": { None: 0, "Sleep Apnea": 1, Insomnia: 2 },
  };

  try {
    return [
      categoryMapping["Gender"][inputData.Gender],
      inputData.Age,
      inputData["Sleep Duration"],
      inputData["Physical Activity Level"],
      inputData["Stress Level"],
      categoryMapping["BMI Category"][inputData["BMI Category"]],
      inputData["Heart Rate"],
      inputData["Daily Steps"],
      categoryMapping["Sleep Disorder"][inputData["Sleep Disorder"]],
    ];
  } catch (error) {
    console.error("Error in input preprocessing:", error);
    return null;
  }
};

module.exports = { preprocessInput };
