// src/components/Navbar.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { FaSignOutAlt, FaUserAlt } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { notifySuccess } from "../utils/toast";
import ThemeLight from "./ThemeLight";
import userContext from "../contexts/userContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const { user } = useContext(userContext);

  const [avatar, setAvatar] = useState(
    localStorage.getItem("avatarUrl") ||
      "https://placehold.co/100x100?text=User"
  );
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "User"
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("avatarUrl");
    localStorage.removeItem("token");
    setAvatar("https://placehold.co/100x100?text=User");
    navigate("/");
    notifySuccess("Logout Successfully");
    setIsOpen(false);
  };

  // Update avatar & username on login
  useEffect(() => {
    const updateAvatar = () => {
      setAvatar(
        localStorage.getItem("avatarUrl") ||
          "https://placehold.co/100x100?text=User"
      );
      setUsername(localStorage.getItem("username") || "User");
    };
    window.addEventListener("avatarUpdated", updateAvatar);
    window.addEventListener("loginSuccess", updateAvatar);
    return () => {
      window.removeEventListener("avatarUpdated", updateAvatar);
      window.removeEventListener("loginSuccess", updateAvatar);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-400 font-semibold"
      : "text-gray-300 hover:text-blue-400";

  return (
    <header className="w-full bg-black/70 backdrop-blur-lg border-b border-blue-800/40 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl sm:text-2xl font-bold text-blue-400">
          FixItNow
        </Link>

        {/* Right nav */}
        <nav className="flex items-center gap-6">
          <ThemeLight />

          {user.role === "client" && (
            <>
              <Link to="/dashboard/client" className={isActive("/dashboard")}>
                Dashboard
              </Link>
              <Link to="/main/client" className={isActive("/client/post")}>
                Post a Job
              </Link>
            </>
          )}

          {user.role === "provider" && (
            <>
              <Link
                to="/dashboard/provider"
                className={isActive("/provider/dashboard")}
              >
                Provider Dashboard
              </Link>
              <Link
                to="/main/provider"
                className={isActive("/job-requirements")}
              >
                Job Requirements
              </Link>
            </>
          )}

          {/* Avatar dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-8 h-8 cursor-pointer rounded-full bg-blue-700 flex items-center justify-center text-white font-bold focus:outline-none"
            >
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-xl shadow-lg ring-1 ring-black/5">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-between items-center px-4 py-2 text-sm hover:bg-gray-100 rounded-t-xl"
                >
                  Profile <FaUserAlt className="text-gray-500 text-xs" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex justify-between items-center w-full px-4 py-2 text-sm transition-colors hover:bg-blue-500 hover:text-white rounded-b-xl"
                >
                  Logout <FaSignOutAlt className="text-xs" />
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
