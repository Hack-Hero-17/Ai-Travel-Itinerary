import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import remarkGfm from "remark-gfm";

const GeminiChat = () => {
  const { chatId } = useParams();
  const [userId, setUserId] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatTitle, setChatTitle] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    places: "",
    budget: "",
    message: "",
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chats/${chatId}`,
          { params: { userId: "user_123" } }
        );
        const chatData = response.data[0];
        setUserId(chatData.userId);
        setChatHistory(chatData.conversation);
        setChatTitle(`Trip to ${chatData.destination}`);
      } catch (error) {
        console.error("Error fetching chat data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatData();
  }, [chatId]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const cleanText = (text) => {
    return text
      .replace(/```/g, "")
      .replace(/\\n/g, "\n")
      .replace(/^[-*]\s+/gm, "• ");
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const { destination, places, budget, message } = formData;
    if (!message.trim()) return;

    // Create a unique messageId for the user's message
    const messageId = uuidv4();

    const userMessage = {
      sender: "user",
      text: message,
      time: getCurrentTime(),
      date: getCurrentDate(),
      messageId,
    };

    const updatedChat = [...chatHistory, userMessage];
    setChatHistory(updatedChat);
    setFormData({ ...formData, message: "" });
    setIsLoading(true);

    if (chatId && destination.trim()) {
      const fullTitle = `Trip to ${destination}`;
      let i = 0;
      const titleInterval = setInterval(() => {
        setChatTitle(fullTitle.substring(0, i + 1));
        i++;
        if (i === fullTitle.length) clearInterval(titleInterval);
      }, 50);
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/gemini/reply",
        {
          destination,
          places,
          budget,
          message,
          userId,
          messageId, // Send messageId to backend for tracking
        }
      );

      const botMessage = {
        sender: "bot",
        text: data.reply,
        time: getCurrentTime(),
        date: getCurrentDate(),
        messageId: uuidv4(), // Generate new messageId for bot's message
      };

      const conversation = [...updatedChat, botMessage];
      setChatHistory(conversation);

      const res = await axios.post("http://localhost:5000/api/chats/store", {
        userId,
        chatId: chatId || undefined,
        destination,
        places,
        budget,
        conversation,
        chatTitle: chatTitle,
      });

      if (!chatId && res.data.chatId) {
        setChatId(res.data.chatId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    setChatHistory([]);
    await axios.post("http://localhost:5000/api/chats/clear", { userId });
  };

  const deleteConversation = async () => {
    setChatHistory([]);
    await axios.post("http://localhost:5000/api/chats/delete", { chatId });
  };

  const renderDateDividers = (msg, idx) => {
    const prev = chatHistory[idx - 1];
    if (!prev || prev.date !== msg.date) {
      const today = new Date();
      const messageDate = new Date(msg.date);

      // Check if it's today
      const isToday = messageDate.toDateString() === today.toDateString();

      // Check if it's yesterday
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const isYesterday =
        messageDate.toDateString() === yesterday.toDateString();

      const label = isToday ? "Today" : isYesterday ? "Yesterday" : msg.date;

      return (
        <div className="flex justify-center my-4">
          <div className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-[12px] shadow-sm border border-gray-300">
            {label}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderTypingLoader = () => (
    <div className="flex justify-start">
      <div className="relative rounded-lg px-3 py-2 bg-white max-w-[65%]">
        <div className="typing-dots flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-screen bg-[url('/travelbg.jpg')] bg-cover bg-center m-0">
      {/* Navbar */}
      <div className="bg-green-600 text-white p-3 flex justify-between items-center shadow-md">
        <h2 className="text-lg font-bold transition-all duration-500">
          {chatTitle}
        </h2>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-xl font-bold"
          >
            ⋮
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
              <button
                onClick={clearChat}
                className="block w-full px-4 py-2 hover:bg-gray-100"
              >
                Clear Chat
              </button>
              <button
                onClick={() => alert("Exporting...")}
                className="block w-full px-4 py-2 hover:bg-gray-100"
              >
                Export Chat
              </button>
              <button
                onClick={deleteConversation}
                className="block w-full px-4 py-2 hover:bg-gray-100"
              >
                Delete Conversation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {chatHistory.map((msg, idx) => {
          const cleanText = msg.text
            .replace(/```/g, "")
            .replace(/\\n/g, "\n")
            .replace(/^[-*]\s+/gm, "• "); // Replace leading - or * with bullet

          return (
            <div key={idx}>
              {renderDateDividers(msg, idx)}
              <div
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className="relative rounded-lg px-3 py-2"
                  style={{
                    backgroundColor:
                      msg.sender === "user" ? "#dcf8c6" : "#ffffff",
                    maxWidth: "65%",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    padding: "0.5rem",
                  }}
                >
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <span className="text-sm text-black">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: (props) => (
                            <table
                              style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                marginTop: "10px",
                                marginBottom: "10px",
                              }}
                              {...props}
                            />
                          ),
                          th: (props) => (
                            <th
                              style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                                backgroundColor: "#f8f8f8",
                              }}
                              {...props}
                            />
                          ),
                          td: (props) => (
                            <td
                              style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                              }}
                              {...props}
                            />
                          ),
                          em: (props) => (
                            <em style={{ fontStyle: "italic" }} {...props} />
                          ),
                          strong: (props) => (
                            <strong style={{ fontWeight: "bold" }} {...props} />
                          ),
                        }}
                      >
                        {cleanText}
                      </ReactMarkdown>
                    </span>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                      {msg.time} {msg.sender === "user" && <span>✓✓</span>}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {isLoading && renderTypingLoader()}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Form */}
      <form
        onSubmit={sendMessage}
        className="bg-white border-t border-gray-300 p-3 flex flex-col gap-2"
      >
        <div className="flex gap-2">
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
            className="flex-1 p-2 rounded-md border border-gray-300"
            required
          />
          <input
            type="text"
            name="places"
            placeholder="Places to visit"
            value={formData.places}
            onChange={handleChange}
            className="flex-1 p-2 rounded-md border border-gray-300"
            required
          />
          <input
            type="text"
            name="budget"
            placeholder="Budget (optional)"
            value={formData.budget}
            onChange={handleChange}
            className="flex-1 p-2 rounded-md border border-gray-300"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            name="message"
            placeholder="Type your travel question..."
            value={formData.message}
            onChange={handleChange}
            className="flex-1 p-3 rounded-full border border-gray-300"
          />
          <button
            type="submit"
            className="bg-green-500 text-white rounded-full px-5 py-2 hover:bg-green-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeminiChat;
