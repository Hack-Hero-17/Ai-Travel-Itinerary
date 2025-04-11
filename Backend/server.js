const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = "mongodb://127.0.0.1:27017/";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI("");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// MongoDB setup
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Schema
const chatSchema = new mongoose.Schema({
  destination: String,
  places: String,
  budget: String,
  conversation: [
    {
      sender: String,
      text: String,
      time: String,
      date: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

// Gemini reply route
app.post("/api/gemini/reply", async (req, res) => {
  const { destination, places, budget, message } = req.body;

  const prompt = `
  You are a friendly and smart AI Travel Itinerary planner 🤖✈️.
  - Provide well-organized, short yet detailed travel itineraries.
  - Use helpful emojis 🌍🧳🍕🏖️🏞️ to represent activities and destinations and but not for every lines you have to use it only for heading and important points.
  - Personalize responses based on the user's input.

  User's Request:
  Destination: ${destination}
  Places to visit: ${places}
  Budget: ${budget || "Not specified"}
  Question: ${message}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ reply: response });
  } catch (error) {
    console.error("Gemini API error:", error.message);
    res
      .status(500)
      .json({ reply: "Sorry, I'm having trouble responding right now." });
  }
});

// Store chat
app.post("/api/chats/store", async (req, res) => {
  const { destination, places, budget, conversation } = req.body;
  try {
    const newChat = new Chat({ destination, places, budget, conversation });
    await newChat.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to store chat" });
  }
});

// Fetch previous chats
app.get("/api/chats/all", async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 }).limit(10);
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching chats" });
  }
});

app.post("/api/chats/clear", async (req, res) => {
  // just clear frontend state, not DB
  res.json({ success: true });
});

app.post("/api/chats/delete", async (req, res) => {
  try {
    await Chat.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete chats" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
