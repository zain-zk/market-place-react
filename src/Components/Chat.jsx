import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { motion } from "framer-motion";
import io from "socket.io-client";
import userContext from "../contexts/userContext";

const socket = io("https://market-place-react.vercel.app");

const ChatPage = () => {
  const navigate = useNavigate();
  const { otherUserId, bidId } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const { user } = useContext(userContext);
  const role = user?.role || "client";

  useEffect(() => {
    async function fetchHistory() {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/messages/${user._id}/${otherUserId}/${bidId}`
        );
        setMessages(data);
      } catch (err) {
        console.error("❌ Error fetching chat history", err);
      }
    }

    if (user && otherUserId) fetchHistory();
  }, [user, otherUserId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!user?._id || !otherUserId) {
      console.error("❌ Missing sender or receiver ID");
      return;
    }

    const msg = {
      sender: user._id,
      receiver: otherUserId,
      text: newMessage,
      bid: bidId,
    };

    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/messages`, msg);

      socket.emit("sendMessage", msg); // send saved message
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
    } catch (err) {
      console.error("❌ Error sending message", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-black to-green-950 text-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-green-900 shadow-md">
        <button
          onClick={() =>
            role === "client" ? navigate("/postedtasks") : navigate("/my-bids")
          }
          className="p-2 hover:bg-green-800 rounded-full"
        >
          <FaArrowLeft size={22} />
        </button>
        <div>
          <h1 className="text-lg font-bold">
            {role === "client" ? "Chat with Provider 🛠" : "Chat with Client 👤"}
          </h1>
          <p className="text-sm text-gray-300">Secure & Private 💬</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              x: msg.sender === user._id ? 50 : -50,
            }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${
              msg.sender === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl shadow-md ${
                msg.sender === user._id
                  ? "bg-black text-green-400 border border-green-700 rounded-br-none"
                  : "bg-green-800 text-white rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="p-4 bg-green-900 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Type a message... ✍️"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-4 py-2 login rounded-full bg-black border border-green-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="p-3 bg-green-600 hover:bg-green-500 rounded-full"
        >
          <FaPaperPlane size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
