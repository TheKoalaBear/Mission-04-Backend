const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const AIChatBot = require("./aiChatBot");

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize AI Chat Bot
const chatBot = new AIChatBot(process.env.GEMINI_API_KEY);

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const result = await chatBot.processMessage(message, sessionId);
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
