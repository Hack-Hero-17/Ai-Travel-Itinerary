import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const ChatPage = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [formData, setFormData] = useState({
    destination: "",
    places: "",
    budget: "",
    message: "",
  });
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    const userMessage = {
      sender: "user",
      text: formData.message,
      time: getCurrentTime(),
      date: new Date().toLocaleDateString(),
    };

    const updatedChat = [...chatHistory, userMessage];
    setChatHistory(updatedChat);
    setFormData({ ...formData, message: "" });

    setIsLoading(true); // Show typing loader

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/gemini/reply",
        {
          destination: formData.destination,
          places: formData.places,
          budget: formData.budget,
          message: userMessage.text,
        }
      );

      const botMessage = {
        sender: "bot",
        text: data.reply,
        time: getCurrentTime(),
        date: new Date().toLocaleDateString(),
      };

      setChatHistory([...updatedChat, botMessage]);

      await axios.post("http://localhost:5000/api/chats/store", {
        destination: formData.destination,
        places: formData.places,
        budget: formData.budget,
        conversation: [...updatedChat, botMessage],
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false); // Hide typing loader
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    axios.post("http://localhost:5000/api/chats/clear");
  };

  const deleteConversation = () => {
    setChatHistory([]);
    axios.post("http://localhost:5000/api/chats/delete");
  };

  const renderDateDividers = (msg, idx) => {
    const prev = chatHistory[idx - 1];
    if (!prev || prev.date !== msg.date) {
      return (
        <div className="text-center text-xs text-gray-500 my-4">
          {msg.date === new Date().toLocaleDateString() ? "Today" : msg.date}
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
        <h2 className="text-lg font-bold">AI Travel Itinerary Chat</h2>
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
        {chatHistory.map((msg, idx) => (
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
                  width: "fit-content",
                  minWidth: "40px",
                  wordBreak: "break-word",
                }}
              >
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <span className="text-sm text-black">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </span>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                    {msg.time} {msg.sender === "user" && <span>✓✓</span>}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && renderTypingLoader()}
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

export default ChatPage;
