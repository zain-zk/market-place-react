import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import userContext from "../contexts/userContext";
import axiosInstance from "../utils/axiosInstance";

let socket; // keep a single instance

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { otherUserId, bidId } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const { user } = useContext(userContext);
  const role = user?.role || "client";

  useEffect(() => {
    if (!user) return;

    if (location.pathname.startsWith("/chat")) {
      socket = io(import.meta.env.VITE_BACKEND_URL, {
        transports: ["websocket"],
      });

      socket.on("receiveMessage", (msg) => {
        if (msg.receiver === user._id) {
          setMessages((prev) => [...prev, msg]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("receiveMessage");
        socket.disconnect();
        socket = null;
      }
    };
  }, [user, location.pathname]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const { data } = await axiosInstance.get(
          `/messages/${user._id}/${otherUserId}/${bidId}`
        );
        setMessages(data);
      } catch (err) {
        console.error("❌ Error fetching chat history", err);
      }
    }
    if (user && otherUserId && bidId) fetchHistory();
  }, [user, otherUserId, bidId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!user?._id || !otherUserId) {
      console.error("❌ Missing sender or receiver ID");
      return;
    }

    if (!bidId) {
      console.error("❌ Missing bidId");
      return;
    }

    const msg = {
      sender: user._id,
      receiver: otherUserId,
      text: newMessage,
      bid: bidId,
    };

    try {
      await axiosInstance.post("/messages", msg);
      if (socket) socket.emit("sendMessage", msg);
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
    <div className="flex flex-col h-screen bg-gradient-to-br bg-black text-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-blue-900 shadow-md">
        <button
          onClick={() =>
            role === "client"
              ? navigate("/postedtasks")
              : navigate("/main/provider")
          }
          className="p-2 hover:bg-blue-800 rounded-full text-white"
        >
          <FaArrowLeft size={22} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">
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
            initial={{ opacity: 0, x: msg.sender === user._id ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${
              msg.sender === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl shadow-md ${
                msg.sender === user._id
                  ? "bg-black text-blue-400 border border-blue-700 rounded-br-none"
                  : "bg-blue-800 text-white rounded-bl-none"
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
        className="p-4 bg-blue-900 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Type a message... ✍️"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-4 py-2 rounded-full bg-black border border-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-3 bg-blue-600 hover:bg-blue-500 rounded-full text-white"
        >
          <FaPaperPlane size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
