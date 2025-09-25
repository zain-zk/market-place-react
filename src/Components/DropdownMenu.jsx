// src/components/DropdownMenu.jsx◘
import { FiEdit } from "react-icons/fi"; // at the top with other imports
import React, { useState, useRef, useEffect } from "react";

const DropdownMenu = ({ onDelete, onEdit }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 
                   border border-gray-600/30 hover:border-gray-500/50
                   text-gray-300 rounded-xl transition-all duration-300"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-40 bg-gray-200 border border-gray-700/50 
                      rounded-xl shadow-lg z-50 animate-fade-in"
        >
          <ul className="py-2 text-sm text-gray-900">
            <li>
              <button
                onClick={onEdit}
                className="w-full text-left px-4 py-2 hover:bg-emerald-600/20 
                            hover:text-blue-400  transition rounded-lg flex items-center gap-2"
              >
                <FiEdit className="text-lg loginput" />{" "}
                <p className="loginput"> Edit</p>
              </button>
            </li>
            <li>
              <button
                onClick={onDelete}
                className="w-full text-left px-4 py-2 hover:bg-red-600/20 
                            hover:text-red-400 transition rounded-lg flex items-center gap-2"
              >
                <p className="loginput"> 🗑 Delete</p>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
