import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import socket from "./socket";
import ToastProvider from "./Components/ToastProvider";
import { notifySuccess } from "./utils/toast";
import userContext from "./contexts/userContext";
import axios from "axios";
import { AppRoutes } from "./routes";

const App = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // define async function inside useEffect
    async function fetchUser() {
      try {
        if (!token) return;
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    // call it immediately
    fetchUser();
  }, [token]); // re-run if token changes
  // ✅ Listen for new messages
  useEffect(() => {
    if (!user) return;

    socket.on("receiveMessage", (msg) => {
      if (msg.receiver === user._id) {
        if (window.location.pathname !== "/chat") {
          notifySuccess(`💬 New Message: ${msg.text}`);
        }
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [user]);

  return (
    <userContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <AppRoutes />
        <ToastProvider />
      </BrowserRouter>
    </userContext.Provider>
  );
};

export default App;
