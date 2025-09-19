// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaBuilding,
  FaTools,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useParams, useNavigate, Link } from "react-router-dom";
import { notifyError, notifyInfo, notifySuccess } from "../utils/toast";

export default function Register() {
  const { role } = useParams(); // "client" or "provider"
  const navigate = useNavigate();
  const inputStyle =
    "w-full px-4 py-3 loginput rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500";

  useEffect(() => {
    if (role !== "client" && role !== "provider") {
      navigate("/register-role", { replace: true });
    }
  }, [role, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState(""); // for client
  const [skill, setSkill] = useState(""); // for provider
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
      confirmPassword,
      phone,
      company,
      skill,
      experience,
      location,
      role, // save the role too
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      const data = await res.json();
      if (password !== confirmPassword) {
        notifyError("Password and Confirm Password dosn't Match");
        return;
      }
      if (res.ok) {
        notifySuccess("Registered Successfully!");
        navigate("/login");
      } else {
        notifyError("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      notifyError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center loginbglight bg-gradient-to-br from-gray-900 to-emerald-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl px-4 sm:px-6"
      >
        <form
          className="
      rounded-2xl shadow-2xl   bg-black/70 border border-emerald-500/20 
      p-6 sm:p-8 md:p-10 backdrop-blur-md
    "
          onSubmit={handleRegister}
        >
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400 text-center mb-2">
            {role === "provider"
              ? "Join as Service Provider"
              : "Join as Client"}
          </h1>
          <p className="text-gray-400 loginput text-center mb-6 sm:mb-8 text-sm sm:text-base">
            {role === "client"
              ? "Register to post jobs and hire trusted experts."
              : "Register to offer your services and grow your business."}
          </p>

          {/* Shared Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <FaUser className="text-emerald-400 shrink-0" />
              <input
                type="text"
                placeholder="Full Name"
                className={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-emerald-400 shrink-0" />
              <input
                type="email"
                placeholder="you@example.com"
                className={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="relative flex items-center gap-2">
              <FaLock className="text-emerald-400 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-4 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

            <div className="relative flex items-center gap-2">
              <FaLock className="text-emerald-400 shrink-0" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className={inputStyle}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-4 cursor-pointer text-gray-400"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

            <div className="flex items-center gap-2 md:col-span-2">
              <FaPhone className="text-emerald-400 shrink-0" />
              <input
                type="text"
                placeholder="+92 300 1234567"
                className={inputStyle}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Role-specific Inputs */}
          {role === "client" ? (
            <div className="flex items-center gap-2 mt-6">
              <FaBuilding className="text-emerald-400 shrink-0" />
              <input
                type="text"
                placeholder="Company / Home Name"
                className={inputStyle}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          ) : (
            <div className="mt-6 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2">
                <FaTools className="text-emerald-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Electrician, Plumber, Painter..."
                  className={inputStyle}
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <FaUser className="text-emerald-400 shrink-0" />
                <input
                  type="number"
                  placeholder="Experience (Years)"
                  className={inputStyle}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-emerald-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Lahore, Pakistan"
                  className={inputStyle}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          )}
          <label className="flex items-center text-sm text-gray-400  mt-2 select-none">
            <input
              type="checkbox"
              required
              className="mr-2 accent-emerald-500 "
            />
            I agree to the platform accessing my information
          </label>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-8  sm:mt-8 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-base sm:text-lg py-3 font-semibold transition"
          >
            Register Now
          </button>

          {/* Back & Auth */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-6 text-xs sm:text-sm">
            <Link
              to="/register-role"
              className="text-gray-400 loginput hover:text-emerald-400 text-center"
            >
              ← Choose a different role
            </Link>
            <p className="text-gray-400 loginput text-center">
              Already have an account?{" "}
              <a href="/login" className="text-emerald-400 hover:underline">
                Login here
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
