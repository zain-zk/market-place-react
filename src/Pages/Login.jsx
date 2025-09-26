// src/pages/LoginPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { notifyError, notifyInfo, notifySuccess } from "../utils/toast.js";
import userContext from "../contexts/userContext.js";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const { user, setUser } = useContext(userContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (user?.role) {
        navigate(`/dashboard/${user.role}`, { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [navigate, user?.role]);

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
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.user.token);
        localStorage.setItem(
          "avatarUrl",
          data.user.avatarUrl || "https://placehold.co/100x100?text=User"
        );
        setUser(data.user);
        notifySuccess("Login Successful!");

        if (data.user.role) {
          navigate(`/dashboard/${data.user.role}`);
        } else {
          navigate("/");
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
    <div className="flex min-h-screen justify-center items-center bg-black">
      <div
        className="
          flex flex-col md:flex-row 
          bg-black rounded-2xl shadow-2xl overflow-hidden 
          w-full max-w-5xl border border-gray-800
        "
      >
        {/* Left - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center text-white">
          <h2 className="text-3xl font-bold mb-2 text-blue-500">
            Welcome Back
          </h2>
          <p className="text-gray-400 mb-8">
            Sign in to continue your journey with FixItNow.
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email */}
            <div className="flex items-center bg-[#111]  px-4 py-3 rounded-lg border border-gray-700">
              <FaEnvelope className="text-blue-500 mr-3" />
              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="off"
                className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Username */}
            <div className="flex items-center bg-[#111] px-4 py-3 rounded-lg border border-gray-700">
              <FaUser className="text-blue-500 mr-3" />
              <input
                type="text"
                placeholder="Username"
                autoComplete="off"
                className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="flex items-center bg-[#111]  px-4 py-3 rounded-lg border border-gray-700">
              <FaLock className="text-blue-500 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-400"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-blue-500 ml-2"
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Login
            </button>
          </form>
          <div className="flex gap-20">
            <p className="text-gray-400 text-sm mt-6">
              Don’t have an account?{" "}
              <Link
                to={"/register-role"}
                className="text-blue-500 hover:underline"
              >
                Register
              </Link>
            </p>
            <p className="text-gray-400 text-sm mt-6">
              <Link to={"/"} className="text-blue-500 hover:underline">
                ⬅Go Back to the Home Page
              </Link>
            </p>
          </div>
        </div>

        {/* Right - Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-black justify-center items-center">
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
