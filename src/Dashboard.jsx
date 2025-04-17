import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import logo from "./assets/web_icon.jpg";

const Dashboard = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const userId = "user_123";
  const limit = 10;

  const fetchChats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chats/recent", {
        params: { userId, skip, limit },
      });

      if (res.data.length < limit) setHasMore(false);
      setChats((prev) => [...prev, ...res.data]);
      setSkip((prev) => prev + limit);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container || !hasMore) return;

    const scrollRight = container.scrollLeft + container.clientWidth;
    const scrollTotal = container.scrollWidth;

    if (scrollRight >= scrollTotal - 50) {
      fetchChats();
    }
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chats]);

  return (
    <div className="relative min-h-screen bg-gray-50 pb-24 font-sans">
      {/* Top Navbar */}
      <div className="bg-white text-black p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-10 h-8" />
          <h1 className="text-xl font-bold font-helvetica">
            AI Travel Itinerary
          </h1>
        </div>
        <button className="bg-black text-white px-4 py-1.5 rounded-md text-sm hover:bg-gray-800">
          Sign In
        </button>
      </div>

      {/* Hero Section */}
      <div className="text-center px-4 py-16">
        <h1 className="text-3xl font-extrabold text-[50px] text-[#f56551] font-helvetica">
          Discover Your Next Adventure with AI:
        </h1>
        <h2 className="pt-4 mt-2 text-2xl font-extrabold text-[40px] font-helvetica">
          Personalized Itineraries at Your Fingertips
        </h2>
        <p className="mt-4 pt-4 text-gray-600 max-w-2xl mx-auto text-[20px] font-helvetica">
          Your personal trip planner and travel curator, creating custom
          itineraries tailored to your interests and budget.
        </p>
      </div>

      {/* Recent Chats Section */}
      <h2 className="text-2xl font-bold font-helvetica text-center mb-4">
        Your Recent Chats
      </h2>

      <div className="bg-gray-100 px-4 py-6 min-h-[300px] w-full overflow-x-auto">
        {loading && chats.length === 0 ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : chats.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-lg font-medium">No chats yet 😴</p>
            <p className="text-sm">Start creating one now!</p>
          </div>
        ) : (
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 w-max"
          >
            {chats.map((chat) => (
              <Link
                key={chat.chatId}
                to={`/chat/${chat.chatId}`}
                className="min-w-[250px] max-w-[250px] bg-white border rounded-lg shadow-md p-4 hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg">{chat.chatTitle}</h3>
                <p className="text-sm text-gray-600">{chat.destination}</p>
                <div className="flex flex-col gap-2 mt-4 max-h-[180px] overflow-y-auto pr-1">
                  <div className="self-center text-xs font-medium text-gray-500 py-1 px-2 bg-gray-200 rounded-md my-2">
                    Recent Messages
                  </div>
                  {chat.conversation.slice(-6).map((msg) => (
                    <div
                      key={msg.messageId}
                      className={`max-w-[80%] px-3 py-2 rounded-xl text-sm shadow-sm break-words ${
                        msg.sender === "user"
                          ? "self-end bg-[#DCF8C6] text-black rounded-br-none"
                          : "self-start bg-white border text-black rounded-bl-none"
                      }`}
                    >
                      <p className="line-clamp-2">
                        {msg.text}
                        {msg.sender === "bot" &&
                          msg.text.length > 100 &&
                          " ..."}
                      </p>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
            {loading && <p className="text-gray-500 ml-4">Loading more...</p>}
          </div>
        )}
      </div>

      {/* Floating Create Button */}
      <button
        onClick={() => navigate("/new")}
        className="fixed bottom-5 right-5 flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] text-white rounded-xl shadow hover:bg-[#1f1f1f] transition"
        title="Start New Chat"
      >
        <FaPlus className="text-sm" />
        <span className="text-sm font-medium">Create</span>
      </button>
    </div>
  );
};

export default Dashboard;
