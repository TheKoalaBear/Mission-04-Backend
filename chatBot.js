const dotenv = require("dotenv");
const readline = require("readline");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function generateInterviewFeedback() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); // Store your API key in an environment variable!
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction:
      "acts as an insurance consultant named Tina to take some input from users and then provide the right insurance policy recommendation also provide reasons to support the recommendation at the end",
  });

  // Opt-in question
  const optIn = await askQuestion(
    rl,
    "Would you like to get insurance recommendations? (yes/no): "
  );
  if (optIn.toLowerCase() !== "yes") {
    console.log("Thank you! Have a great day!");
    rl.close();
    return;
  }

  // Ask for car model and age
  const carModel = await askQuestion(rl, "Enter the car model: ");
  const vehicleAge = await askQuestion(
    rl,
    "Enter the age of the vehicle in years: "
  );

  // Determine vehicle type based on car model using AI
  const vehicleTypePrompt = `Determine the type of vehicle for the following car model: ${carModel}. The possible types are car, truck, racing car, or other.`;
  let vehicleType;
  console.log(vehicleTypePrompt);
  try {
    const result = await model.generateContent(vehicleTypePrompt);
    const responseText = result.response.text;
    vehicleType = responseText.trim().toLowerCase();
  } catch (error) {
    console.error("Error determining vehicle type:", error);
    console.log("Unable to determine vehicle type. Please try again later.");
    rl.close();
    return;
  }
  console.log(`The vehicle type is: ${vehicleType}`);

  // Recommend insurance products based on business rules
  const recommendations = [];
  const reasons = [];

  if (vehicleType !== "truck" || vehicleType !== "racing car") {
    recommendations.push("Mechanical Breakdown Insurance (MBI)");
    reasons.push("MBI is available for your vehicle type.");
  }

  if (parseInt(vehicleAge) < 10) {
    recommendations.push("Comprehensive Car Insurance");
    reasons.push(
      "Comprehensive Car Insurance is available for vehicles less than 10 years old."
    );
  }

  recommendations.push("Third Party Car Insurance");
  reasons.push(
    "Third Party Car Insurance is available for all vehicle types and ages."
  );

  console.log(
    "Based on your input, we recommend the following insurance products:"
  );
  recommendations.forEach((rec, index) => {
    console.log(`${rec}: ${reasons[index]}`);
  });

  rl.close();
}

generateInterviewFeedback();
