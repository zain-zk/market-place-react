import React, { useState, useEffect } from "react";
import {
  FaUserAlt,
  FaBriefcase,
  FaSignOutAlt,
  FaTasks,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdPostAdd, MdWork } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { notifySuccess } from "../utils/toast";
import ThemeLight from "./ThemeLight";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatar, setAvatar] = useState(
    localStorage.getItem("avatarUrl") ||
      "https://placehold.co/100x100?text=User"
  );

  const handleLogout = () => {
    localStorage.removeItem("avatarUrl");
    setAvatar("https://placehold.co/100x100?text=User");
    localStorage.removeItem("token");
    navigate("/");
    notifySuccess("Logout Successfully");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-green-900 text-black"
      : "hover:bg-green-900 hover:text-white";

  useEffect(() => {
    const updateAvatar = () => {
      const updatedAvatar =
        localStorage.getItem("avatarUrl") ||
        "https://placehold.co/100x100?text=User";
      setAvatar(updatedAvatar);
    };

    updateAvatar();
    window.addEventListener("avatarUpdated", updateAvatar);
    window.addEventListener("loginSuccess", updateAvatar);

    return () => {
      window.removeEventListener("avatarUpdated", updateAvatar);
      window.removeEventListener("loginSuccess", updateAvatar);
    };
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 loginbglight bg-gradient-to-r from-[#011508] via-[#002f00] to-[#093406] flex-col p-6 text-gray-200 shadow-2xl">
        <div className="ml-5 flex gap-3 flex-row ">
          <div className="mb-10 mt-5 flex flex-col items-center">
            <div className="flex flex-col items-center mb-6">
              <img
                src={avatar}
                alt="Profile"
                className="w-full aspect-square h-full rounded-full object-cover border-2 border-green-500"
              />
            </div>
            <h2 className="text-3xl  font-bold  sidebar tracking-wide">
              Talent Hub
            </h2>
          </div>
          <div>
            <ThemeLight />
          </div>
        </div>

        <nav className="flex flex-col gap-3 flex-grow">
          <Link
            to="/profile"
            className={`flex items-center gap-3 px-4 py-3 sidebar rounded-lg transition-all ${isActive(
              "/profile"
            )}`}
          >
            <FaUserAlt /> Profile
          </Link>

          {role === "client" ? (
            <>
              <Link
                to="/main/client"
                className={`flex items-center gap-3 px-4 py-3 sidebar rounded-lg transition-all ${isActive(
                  "/main/client"
                )}`}
              >
                <MdPostAdd /> Post Requirement
              </Link>
              <Link
                to="/postedtasks"
                className={`flex items-center gap-3 sidebar  px-4 py-3 rounded-lg transition-all ${isActive(
                  "/postedtasks"
                )}`}
              >
                <FaTasks /> My Posted Tasks
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/main/provider"
                className={`flex items-center gap-3 px-4 py-3 sidebar rounded-lg transition-all ${isActive(
                  "/main/provider"
                )}`}
              >
                <MdWork /> Browse Projects
              </Link>
              <Link
                to="/my-bids"
                className={`flex items-center gap-3 sidebar px-4 py-3 rounded-lg transition-all ${isActive(
                  "/my-bids"
                )}`}
              >
                <FaBriefcase /> My Bids
              </Link>
            </>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3  sidebar mt-auto cursor-pointer rounded-lg transition-all hover:bg-red-600 hover:text-white"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Mobile / Tablet Topbar */}
      {/* Mobile / Tablet Topbar */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-gradient-to-r from-[#011508] via-[#002f00] to-[#093406] text-gray-200 shadow-md z-50">
        {/* Top bar with avatar + title + theme toggle + menu button */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Avatar + Title */}
          <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-green-500"
            />
            <h2 className="text-xl font-bold sidebar">Talent Hub</h2>
          </div>

          {/* Right: Theme toggle + menu button */}
          <div className="flex items-center gap-3">
            <ThemeLight />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-3xl focus:outline-none"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Slide-down menu */}
        {menuOpen && (
          <div className="flex flex-col loginbglight bg-gradient-to-r from-[#011508] via-[#002f00] to-[#093406] px-4 pb-4 gap-3">
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(
                "/profile"
              )}`}
            >
              <FaUserAlt /> Profile
            </Link>

            {role === "client" ? (
              <>
                <Link
                  to="/main/client"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(
                    "/main/client"
                  )}`}
                >
                  <MdPostAdd /> Post Requirement
                </Link>
                <Link
                  to="/postedtasks"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(
                    "/postedtasks"
                  )}`}
                >
                  <FaTasks /> My Posted Tasks
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/main/provider"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(
                    "/main/provider"
                  )}`}
                >
                  <MdWork /> Browse Projects
                </Link>
                <Link
                  to="/my-bids"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(
                    "/my-bids"
                  )}`}
                >
                  <FaBriefcase /> My Bids
                </Link>
              </>
            )}

            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all hover:bg-red-600 hover:text-white"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
