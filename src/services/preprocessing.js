const preprocessInput = (inputData) => {
    // Validasi input
    const expectedFields = [
      "Gender",
      "Age",
      "Sleep Duration",
      "Physical Activity Level",
      "Stress Level",
      "BMI Category",
      "Heart Rate",
      "Daily Steps",
      "Sleep Disorder",
    ];
    const missingFields = expectedFields.filter((field) => !(field in inputData));
    if (missingFields.length > 0) {
      console.error(`Missing fields: ${missingFields.join(", ")}`);
      return null;
    }
    // Encode kategori
    const categoryMapping = {
      Gender: { Male: 0, Female: 1 },
      "BMI Category": { "Normal Weight": 0, Normal: 1, Overweight: 2, Obese: 3 },
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
    } catch (err) {
      console.error("Error in preprocessing input:", err);
      return null;
    }
  };
  module.exports = { preprocessInput };