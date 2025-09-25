// src/pages/RegisterRole.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTools, FaUserTie } from "react-icons/fa";

const RegisterRole = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex justify-center items-center p-5">
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl text-white shadow-xl p-6 sm:p-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">
          Select Your Role
        </h2>
        <p className="text-gray-300 mb-8 text-sm sm:text-base">
          Choose how you want to use the platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service Provider Card */}
          <div
            onClick={() => navigate("/register/provider")}
            className="bg-black border-2 border-blue-600 rounded-xl p-6 cursor-pointer transform transition hover:scale-105 hover:shadow-xl hover:shadow-blue-600/20"
          >
            <FaTools size={40} className="mx-auto text-blue-400" />
            <h3 className="text-blue-400 mt-4 mb-2 text-lg font-semibold">
              Service Provider
            </h3>
            <p className="text-gray-300 text-sm">
              Join as a plumber, electrician, or other skilled worker. Find job
              posts from clients and get hired for tasks.
            </p>
          </div>

          {/* Client Card */}
          <div
            onClick={() => navigate("/register/client")}
            className="bg-black border-2 border-blue-600 rounded-xl p-6 cursor-pointer transform transition hover:scale-105 hover:shadow-xl hover:shadow-blue-600/20"
          >
            <FaUserTie size={40} className="mx-auto text-blue-400" />
            <h3 className="text-blue-400 mt-4 mb-2 text-lg font-semibold">
              Client
            </h3>
            <p className="text-gray-300 text-sm">
              Post jobs for your home or business, review bids from service
              providers, and hire the best fit for your task.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterRole;
