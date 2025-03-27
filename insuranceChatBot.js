const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const readline = require("readline");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction:
    "You are a helpful insurance consultant assistant. You help users by recommending the best car insurance policy.",
});

async function getIntroQuestion() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const introQuestion = await new Promise((resolve) => {
    rl.question("Do you need help with car insurance? ", (answer) => {
      resolve(answer);
      rl.close();
    });
  });

  return introQuestion;
}

async function firstQuestion(history, introduction) {
  const chat = model.startChat({
    history: history,
  });

  let result = await chat.sendMessage(introduction);
  console.log(result.response.text());
}

async function sendUserMessage(history) {
  let chatText = "";

  const chat = model.startChat({
    history: history,
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const userInput = await new Promise((resolve) => {
    rl.question("Your response: ", (answer) => {
      resolve(answer);
      rl.close();
    });
  });

  let result = await chat.sendMessage(userInput);
  console.log(result.response.text());
  chatText = result.response.text();
  let updatedHistory = JSON.parse(JSON.stringify(history));
  updatedHistory.push({
    role: "user",
    parts: [{ text: userInput }],
  });
  updatedHistory.push({
    role: "model",
    parts: [{ text: chatText }],
  });
  return { chatText, updatedHistory };
}

(async () => {
  const introQuestion = await getIntroQuestion();

  let history = [
    {
      role: "user",
      parts: [
        {
          text: "\n\n1. DO NOT HALLUCINATE.\n2. Use only English.\n3. Use a fun, professional tone.\n4. These are the only available insurance products: Mechanical Breakdown Insurance (MBI), Comprehensive Car Insurance, and Third Party Car Insurance.\n5. Mechanical Breakdown Insurance (MBI) is not available to trucks or sports cars.\n6. Comprehensive Car Insurance is only available for any motor vehicles less than 10 years old.\n7. Follow each step, one at a time, in a conversational tone.\n\nStep 1: Ask the user about their car make and model to check if their car is valid for the insurance policy.\nStep 2: Ask the user how old their vehicle is to check if it's valid for this policy.\nStep 3: Ask the user about their budget so you can get insight on which policy you can recommend.\nStep 4: Ask the user about their needs so you can get insight on which policy you can recommend.\nStep 6: Ask the user about their vehicle usageso you can get insight on which policy you can recommend.\nStep 7: Give a recommendation to the user of the best insurance product.",
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: `${introQuestion} I need help with choosing the best car insurance policy? `,
        },
      ],
    },
    {
      role: "model",
      parts: [{ text: "Tell me about yourself." }],
    },
  ];

  await firstQuestion(history, introQuestion);

  const numberOfQuestions = 999;

  for (let i = 0; i < numberOfQuestions; i++) {
    const { chatText, updatedHistory } = await sendUserMessage(history);
    history = updatedHistory;
  }
})();
