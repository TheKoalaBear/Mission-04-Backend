const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIChatBot {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction:
        "You are a helpful insurance consultant assistant. You help users by recommending the best car insurance policy.",
    });
    this.chatHistories = new Map();
  }

  initializeChatHistory(sessionId) {
    if (!this.chatHistories.has(sessionId)) {
      this.chatHistories.set(sessionId, [
        {
          role: "user",
          parts: [
            {
              text: "\n\n1. DO NOT HALLUCINATE.\n2. Use only English.\n3. Use a fun, professional tone.\n4. These are the only available insurance products: Mechanical Breakdown Insurance (MBI), Comprehensive Car Insurance, and Third Party Car Insurance.\n5. Mechanical Breakdown Insurance (MBI) is not available to trucks or sports cars.\n6. Comprehensive Car Insurance is only available for any motor vehicles less than 10 years old.\n7. Follow each step, one at a time, in a conversational tone while keeping the conversation short and concise.\n\nStep 1: Ask the user about their car make and model to check if their car is valid for the insurance policy.\nStep 2: Ask the user how old their vehicle is to check if it's valid for this policy.\nStep 3: Ask the user about their budget so you can get insight on which policy you can recommend.\nStep 4: Ask the user about their needs so you can get insight on which policy you can recommend.\nStep 6: Ask the user about their vehicle usageso you can get insight on which policy you can recommend.\nStep 7: Give a recommendation to the user of the best insurance product.",
            },
          ],
        },
      ]);
    }
  }

  async processMessage(message, sessionId) {
    try {
      this.initializeChatHistory(sessionId);
      const history = this.chatHistories.get(sessionId);
      const chat = this.model.startChat({ history });

      // Add user message to history
      history.push({
        role: "user",
        parts: [{ text: message }],
      });

      // Get AI response
      const result = await chat.sendMessage(message);
      const response = result.response.text();

      // Add AI response to history
      history.push({
        role: "model",
        parts: [{ text: response }],
      });

      return { response };
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Failed to process chat message");
    }
  }
}

module.exports = AIChatBot;
