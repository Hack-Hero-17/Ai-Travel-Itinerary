const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const expenseRoutes = require("./routes/Expenses");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/expenses", expenseRoutes);
const User = require("./models/User");
// const router = express.Router();

const PORT = process.env.PORT || 5000;
const MONGO_URI = "mongodb://127.0.0.1:27017/testdb";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI("AIzaSyCLjMUX-hqIdmqsS5WP1LIS-4slLj3V6oc");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// MongoDB setup
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Schema
const chatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  destination: String,
  places: String,
  budget: String,
  conversation: [
    {
      messageId: {
        type: String,
        required: true,
      },
      sender: String,
      text: String,
      time: String,
      date: String,
    },
  ],
  chatTitle: {
    type: String,
    required: true,
  },
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
- Use helpful emojis 🌍🧳🍕🏖️🏞️ for headings and important points.
- Personalize responses based on the user's input.
- Also want the response in more prettier formatted way including tabspaces and good headings.
- don't use any extra md formatting such as " - or * " for points use "•" for points.
- dont use "-" or "*" for points use "•" for points.
- give summary table at the end of the response using markdown table format such as use of '|' which include the necessary important details such as day , location, activities , expenses.

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

// Store chat with generated chatId
app.post("/api/chats/store", async (req, res) => {
  const {
    userId,
    destination,
    places,
    budget,
    conversation,
    chatTitle,
    chatId,
  } = req.body;

  if (!userId) return res.status(400).json({ message: "Missing userId" });
  if (!chatTitle)
    return res.status(400).json({ message: "Chat title is required" });
  if (!conversation || !Array.isArray(conversation)) {
    return res
      .status(400)
      .json({ message: "Conversation must be an array of messages" });
  }

  try {
    let chat = await Chat.findOne({ chatId });

    if (chat) {
      // Existing chat → filter out messages already stored by messageId
      const existingMessageIds = new Set(
        chat.conversation.map((msg) => msg.messageId)
      );

      const newMessages = conversation.filter(
        (msg) => !existingMessageIds.has(msg.messageId)
      );

      if (newMessages.length === 0) {
        return res.json({
          success: true,
          message: "No new messages to add",
          chatId,
        });
      }

      await Chat.updateOne(
        { chatId },
        { $push: { conversation: { $each: newMessages } } }
      );

      return res.json({
        success: true,
        message: `${newMessages.length} new message(s) added`,
        chatId,
      });
    } else {
      // New chat → create with all messages
      const newChat = new Chat({
        chatId,
        userId,
        destination,
        places,
        budget,
        conversation,
        chatTitle,
      });

      await newChat.save();
      return res.json({ success: true, message: "New chat created", chatId });
    }
  } catch (err) {
    console.error("Error storing or updating chat:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to store or update chat" });
  }
});

// Get chat summaries with chatId and chatTitle

app.get("/api/chats/recent", async (req, res) => {
  const { userId, skip = 0, limit = 10 } = req.query;

  if (!userId) return res.status(400).json({ message: "Missing userId" });

  try {
    const chats = await Chat.find(
      { userId },
      {
        _id: 1,
        chatId: 1,
        chatTitle: 1,
        destination: 1,
        createdAt: 1,
        conversation: { $slice: -6 }, // last 6 messages
      }
    )
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    res.json(chats);
  } catch (err) {
    console.error("Error fetching chat summaries:", err);

    res.status(500).json({ message: "Failed to fetch chat summaries" });
  }
});

// Get full chat by chatId
app.get("/api/chats/:chatId", async (req, res) => {
  const { userId } = req.query;

  if (!userId) return res.status(400).json({ message: "Missing userId" });

  try {
    const chat = await Chat.find({ chatId: req.params.chatId, userId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch chat" });
  }
});

// Clear frontend state only
app.post("/api/chats/clear", async (req, res) => {
  res.json({ success: true });
});

// Delete all chats for a user
app.post("/api/chats/delete", async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) return res.status(400).json({ message: "Missing chatId" });

  try {
    await Chat.deleteMany({ chatId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete chats" });
  }
});

app.post("/api/user/signup", async (req, res) => {
  const { userId, email, password, registrationTime } = req.body;

  try {
    // Check for missing fields
    if (!userId || !email || !password || !registrationTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save the user data to the database, including the hashed password
    const newUser = new User({
      userId,
      email,
      password, // Save the hashed password (already hashed from frontend)
      registrationTime,
    });

    await newUser.save();
    res.status(201).json({ message: "User successfully registered!" });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ error: "Failed to register user!" });
  }
});

// POST /api/user/login (for verification)
app.post("/api/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare hashed password with the one in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
