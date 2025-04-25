import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import logo from "./assets/web_icon.jpg";

const Dashboard = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [typingText, setTypingText] = useState(""); // State for the typing text

  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Check for userId in both localStorage and sessionStorage
  const userId =
    localStorage.getItem("userId") || sessionStorage.getItem("userId") || null;
  const limit = 10;

  const fetchChats = async () => {
    if (!userId) return;
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

  // Typewriter effect
  useEffect(() => {
    const text =
      "To view your chats and personalized itineraries, please login or sign up.";
    let index = 0;

    // Function to handle the typing effect
    const startTyping = () => {
      setTypingText(""); // Clear the text before typing starts
      let index = -1;
      const typingInterval = setInterval(() => {
        setTypingText((prev) => prev + text[index]);
        index += 1;
        if (index === text.length - 1) {
          clearInterval(typingInterval);

          // Restart the typing effect after a delay (e.g., 2 seconds)
          setTimeout(startTyping, 2000); // 2000ms delay before restarting
        }
      }, 100); // Adjust the speed here
    };

    startTyping(); // Start the typing effect initially
  }, []);

  useEffect(() => {
    if (userId) {
      fetchChats();
    } else {
      setLoading(false); // Stop loading if the user is not logged in
    }
  }, [userId]);

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
      <div className="sticky top-0 z-50 bg-white text-black p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-10 h-8" />
          <h1 className="text-xl font-bold font-helvetica">
            AI Travel Itinerary
          </h1>
        </div>

        {/* Add Expenses Link */}

        <div className="flex gap-4">
          {userId && (
            <Link
              to="/expenses"
              className="text-sm font-medium text-[1rem] text-black hover:bg-gray-200 px-4 py-1.5 rounded-md font-helvetica"
            >
              Expenses
            </Link>
          )}

          {userId && (
            <Link
              to="/profile"
              className="text-sm font-medium text-[1rem] text-black hover:bg-gray-200 px-4 py-1.5 rounded-md font-helvetica"
            >
              Profile
            </Link>
          )}

          {/* Sign In / Logout button logic */}
          {userId ? (
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                navigate("/login");
                window.location.reload(); // Optional to reset all states
              }}
              className="bg-black text-white px-4 py-1.5 rounded-md text-sm hover:bg-gray-800"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-black text-white px-4 py-1.5 rounded-md text-sm hover:bg-gray-800"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center px-4 py-16 font-helvetica">
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

      {/* Login/Signup Message (Only visible if not logged in) */}
      {!userId && (
        <div className="flex flex-col items-center justify-center  bg-gray-50 py-8 px-6 font-helvetica">
          <div className="bg-white shadow-lg p-8 rounded-lg text-center max-w-[800px] w-full">
            <h2 className="text-3xl font-semibold text-[#2d3748] mb-4 font-helvetica">
              Welcome to AI Travel Itinerary
            </h2>
            <p className="text-lg text-gray-600 text-cool-gray-100 mb-6 font-helvetica">
              {typingText}
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => navigate("/login")}
                className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-grey-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-grey-700 transition"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Section (Only visible if logged in) */}
      {userId && (
        <>
          <h2 className="text-2xl font-bold font-helvetica text-center mb-4">
            Your Recent Chats
          </h2>
          <div className="p-5 bg-gray-100 min-h-[300px] flex flex-col items-center">
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
                className="flex overflow-x-auto space-x-4 py-4"
              >
                {chats.map((chat) => (
                  <Link
                    key={chat.chatId}
                    to={`/chat/${chat.chatId}`}
                    className="min-w-[200px] bg-white border rounded-lg shadow-md p-4 hover:shadow-lg transition"
                  >
                    <h3 className="font-bold text-xl font-helvetica">
                      {chat.chatTitle}
                    </h3>
                    <p className="text-sm text-gray-600">{chat.destination}</p>
                    <div
                      className="flex flex-col gap-2 mt-4 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar"
                      ref={chatContainerRef}
                    >
                      {/* Time divider */}
                      <div className="self-center text-xs font-medium text-gray-500 py-1 px-2 bg-gray-200 rounded-md my-2">
                        Recent Messages
                      </div>

                      {/* Last 6 messages */}
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
                {loading && (
                  <p className="text-gray-500 ml-4">Loading more...</p>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Create Button */}
      {userId && (
        <button
          onClick={() => navigate("/new")}
          className="fixed bottom-5 right-5 flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] text-white rounded-xl shadow hover:bg-[#1f1f1f] transition"
          title="Start New Chat"
        >
          <FaPlus className="text-sm" />
          <span className="text-sm font-medium">Create</span>
        </button>
      )}
    </div>
  );
};

export default Dashboard;
