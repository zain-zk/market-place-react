// src/pages/LoginPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { notifyError, notifyInfo, notifySuccess } from "../utils/toast.js";
import userContext from "../contexts/userContext.js";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useContext(userContext);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (user?.role) {
        navigate(`/dashboard`, { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [navigate, user?.role]);
  // ✅ Updated handleLogin (cleaner + role navigation)
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      notifyError("Please enter email and password");
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }), // ✅ no name
        }
      );

      const data = await res.json();

      if (res.ok) {
        // ✅ Store token + user separately
        localStorage.setItem("token", data.user.token);
        localStorage.setItem(
          "avatarUrl",
          data.user.avatarUrl || "https://placehold.co/100x100?text=User"
        );
        setUser(data.user); // Update context
        notifySuccess("Login Successful!");

        // ✅ Navigate based on role
        if (user?.role) {
          navigate(`/main/${data.user.role}`);
        } else {
          navigate("/"); // fallback
        }
      } else {
        notifyInfo("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      notifyError("Something went wrong");
    }
  };

  return (
    <div
      className="flex min-h-screen  justify-center items-center loginbglight loginbgdark    
     "
    >
      {/* Card */}
      <div
        className="
        login
          flex flex-col md:flex-row 
          bg-[#0b1114] rounded-2xl shadow-2xl overflow-hidden 
          w-full max-w-5xl  border border-emerald-900/30 
        "
      >
        {/* Left - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10  flex flex-col justify-center text-white">
          <h2 className="text-3xl font-bold mb-2 text-emerald-400">
            Welcome Back
          </h2>
          <p className="text-gray-400 mb-8 ">
            Sign in to continue your journey with FixItNow.
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email */}
            <div className="flex items-center bg-[#0b1512] px-4 py-3 rounded-lg border border-emerald-900/30">
              <FaEnvelope className="text-emerald-400 mr-3" />
              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="off"
                className="bg-transparent loginput outline-none text-sm w-full text-white placeholder-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Username */}
            <div className="flex items-center bg-[#0b1512] px-4 py-3 rounded-lg border border-emerald-900/30">
              <FaUser className="text-emerald-400 mr-3" />
              <input
                type="text"
                placeholder="Username"
                autoComplete="off"
                className="bg-transparent loginput outline-none text-sm w-full text-white placeholder-gray-500"
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="flex items-center bg-[#0b1512] px-4 py-3 rounded-lg border border-emerald-900/30">
              <FaLock className="text-emerald-400 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="bg-transparent loginput outline-none text-sm w-full text-white placeholder-gray-500"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-emerald-400 ml-2"
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Checkbox */}
            {/* <label className="flex items-center text-sm text-gray-400  select-none">
              <input
                type="checkbox"
                required
                className="mr-2 accent-emerald-500 "
              />
              I agree to the platform accessing my information
            </label> */}

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Login
            </button>
          </form>

          <p className="text-gray-400 text-sm mt-6 ">
            Don’t have an account?{" "}
            <Link
              to={"/register-role"}
              className="text-emerald-400 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Right - Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#07130d] to-[#0e1f17] justify-center items-center">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
            alt="Service professional at work"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
