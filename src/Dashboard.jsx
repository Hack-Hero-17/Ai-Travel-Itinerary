// In Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const RecentChats = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    axios.get("/api/chats/all").then((res) => setChats(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Recent Travel Chats</h2>
      {chats.map((chat, idx) => (
        <div key={idx} className="mb-3 p-3 border rounded bg-gray-50">
          <p>
            <strong>Destination:</strong> {chat.destination}
          </p>
          <p>
            <strong>Places:</strong> {chat.places}
          </p>
          <p>
            <strong>Budget:</strong> {chat.budget || "N/A"}
          </p>
          <p>
            <strong>Last Message:</strong>{" "}
            {chat.conversation.slice(-1)[0]?.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RecentChats;
