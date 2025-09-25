import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ToastProvider from "./Components/ToastProvider";
import userContext from "./contexts/userContext";
import { AppRoutes } from "./routes";
import axiosInstance from "./utils/axiosInstance";

const App = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // define async function inside useEffect
    async function fetchUser() {
      try {
        if (!token) return;
        const res = await axiosInstance.get("/users/me", {
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
