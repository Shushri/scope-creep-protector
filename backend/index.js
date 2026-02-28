require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow Vercel frontend or default broadly for hackathon
}));
app.use(express.json());

const port = process.env.PORT || 5000;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_API_KEY");

app.post("/api/check-message", async (req, res) => {
  try {
    const { contract, message } = req.body;

    if (!contract || !message) {
      return res.status(400).json({ error: "Missing contract or message" });
    }

    // Initialize the model
    // Using gemini-2.5-flash as it's the standard model for general text tasks
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an AI contract assistant. Read this contract:
${contract}

Now read this client message:
${message}

Determine if the client is asking for something outside the scope of the contract. Respond ONLY with a valid JSON object. Do not wrap it in markdown blockquotes or add any other text.
Example: {"isOut_of_scope": true, "reason": "You asked for backend work. Contract is only frontend."}`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();

    // Sometimes Gemini wraps JSON in markdown blocks even when told not to.
    if (responseText.startsWith("\`\`\`json")) {
      responseText = responseText.substring(7);
      if (responseText.endsWith("\`\`\`")) {
        responseText = responseText.substring(0, responseText.length - 3);
      }
    } else if (responseText.startsWith("\`\`\`")) {
      responseText = responseText.substring(3);
      if (responseText.endsWith("\`\`\`")) {
        responseText = responseText.substring(0, responseText.length - 3);
      }
    }

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Gemini response:", responseText);
      // Fallback response so the app doesn't crash completely
      parsedData = { isOut_of_scope: false, reason: "Error parsing AI response" };
    }

    res.json(parsedData);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
