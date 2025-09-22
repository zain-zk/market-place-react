// src/pages/MainPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaGavel,
  FaSearch,
} from "react-icons/fa";
import { MdWork } from "react-icons/md";
import Sidebar from "../Components/Sidebar";
import BidDrawer from "../Components/BidDrawer";
import { notifyError, notifyInfo, notifySuccess } from "../utils/toast";
import userContext from "../contexts/userContext";
import axiosInstance from "../utils/axiosInstance";

const MainPage = ({ role: propRole }) => {
  const navigate = useNavigate();
  const { user } = useContext(userContext);
  // ✅ get user from context
  const role = propRole || user?.role;
  const userId = user?._id || user?.id;

  // ✅ states for posting requirements
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ provider side state
  const [requirements, setRequirements] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // ✅ drawer for placing bids
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // ✅ search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfession, setSelectedProfession] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // 🔹 fetch tasks
  useEffect(() => {
    if (role === "provider") {
      fetchRequirements();
    }
  }, [role]);

  const fetchRequirements = async () => {
    try {
      setLoadingTasks(true);
      const res = await axiosInstance.get("/requirements");

      const data = res.data;
      if (res.status === 200) {
        setRequirements(data);
      } else {
        console.error("Error fetching requirements:", data.message);
      }
    } catch (err) {
      console.error("❌ Server error:", err);
    } finally {
      setLoadingTasks(false);
    }
  };

  // ✅ filter tasks
  const filteredTasks = requirements.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.profession?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProfession = selectedProfession
      ? task.profession?.toLowerCase() === selectedProfession.toLowerCase()
      : true;
    const cityMatch = selectedCity
      ? task.location?.toLowerCase().includes(selectedCity.toLowerCase())
      : true;

    return matchesProfession && cityMatch && matchesSearch;
  });
  const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Sargodha"];

  // ✅ handle form submit (client posting requirement)
  const handlePostRequirement = async (e) => {
    e.preventDefault();

    if (!title || !description || !price || !location) {
      notifyInfo("⚠️ Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: userId,
          title,
          description,
          price,
          location,
        }),
      });

      const data = res.data;
      if (res.status === 200) {
        notifySuccess("✅ Requirement posted successfully!");
        setTitle("");
        setDescription("");
        setPrice("");
        setLocation("");
        navigate("/postedtasks");
      } else {
        notifyInfo(data.message || "❌ Something went wrong");
      }
    } catch (err) {
      console.error(err);
      notifyError("❌ Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = (bid) => {
    // console.log(`Bid of PKR ${bid} placed on:`, selectedTask);
    // TODO: send bid + taskId to backend API
  };

  return (
    <div className="flex min-h-screen  bg-black text-white">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <main className="flex-1 p-10  bg-gradient-to-br from-black to-green-950">
        {role === "client" ? (
          // ================== CLIENT ==================
          <main className="flex-1 lg:ml-64  pt-20 lg:pt-10 min-h-screen">
            <div className="max-w-4xl mx-auto px-4   sm:px-6 lg:px-8">
              {/* Header */}
              <div className="text-center  mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Welcome, Client
                </h1>
                <p className="text-gray-400 text-lg mt-4">
                  Post your requirements and connect with top service providers
                  tailored to your needs.
                </p>
              </div>

              {/* Card */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-black/85 to-green-950/80 
                 border border-green-800/40 backdrop-blur-xl 
                 p-6 sm:p-10 rounded-3xl shadow-2xl 
                 hover:shadow-green-900/30 transition"
              >
                <h2 className="text-2xl font-semibold text-green-300 mb-8 text-center">
                  Post a New Requirement
                </h2>

                <form onSubmit={handlePostRequirement} className="grid gap-7">
                  {/* Title */}
                  <div>
                    <label className="block loginput text-sm font-medium text-gray-300 mb-2">
                      Requirement Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter a clear title"
                      className="w-full loginput p-4 rounded-xl bg-black/70 border border-green-700 text-white 
                       placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block loginput text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe your requirement in detail..."
                      rows="5"
                      className="w-full loginput p-4 rounded-xl bg-transparent border border-green-700 text-white 
                       placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  {/* Budget + Location */}
                  <div className="grid  grid-cols-1 md:grid-cols-2 gap-7">
                    <div>
                      <label className="block loginput text-sm font-medium text-gray-300 mb-2">
                        Budget (PKR)
                      </label>
                      <input
                        type="number"
                        placeholder="Enter your budget"
                        className="w-full p-4 rounded-xl loginput bg-black/70 border border-green-700 text-white 
                         placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block loginput text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Karachi"
                        className="w-full loginput p-4 rounded-xl bg-black/70 border border-green-700 text-white 
                         placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Button */}
                  <div className="text-center mt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 
                       text-black px-10 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg 
                       hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Posting..." : "Post Requirement"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </main>
        ) : (
          // ================== PROVIDER ==================
          <div className="flex-1  lg:ml-64 pt-20 lg:pt-2  p-4 ">
            <h1 className="text-3xl font-bold mb-6 text-green-400 flex items-center gap-2">
              Welcome, Service Provider <MdWork className="text-yellow-400" />
            </h1>
            <p className="text-gray-300 mb-4">
              Browse projects and place your bids to get started ✨
            </p>

            {/* 🔍 Search Bar */}
            <div className="flex flex-col gap-3  mb-6">
              <div className="relative ">
                <FaSearch className="absolute  left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by profession, city or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full serviceinput pl-10 pr-4 py-2 rounded-xl bg-gray-800/50 text-gray-200
                             border border-gray-600/30 focus:border-emerald-500 focus:ring-1 
                             focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* 🎯 Profession Tags */}
            </div>
            {/* 🏙 City Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <button
                onClick={() => setSelectedCity("")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  selectedCity === ""
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-600"
                }`}
              >
                All Cities
              </button>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    selectedCity === city
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-700/50 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
            {/* Tasks */}
            {loadingTasks ? (
              <p className="text-gray-400">⏳ Loading tasks...</p>
            ) : filteredTasks.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className="group relative overflow-hidden"
                  >
                    <div
                      className="relative bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-xl 
                                 border border-emerald-700/100 rounded-3xl p-8 h-full
                                 hover:border-emerald-500/50 transition-all duration-500
                                 bgcard
                                 hover:shadow-2xl hover:shadow-emerald-500/20
                                 group-hover:scale-[1.02] group-hover:-translate-y-1"
                    >
                      <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                          {task.title} 📋
                        </h2>
                        <p className="text-gray-300 mb-4">{task.description}</p>

                        <div className="space-y-2 text-sm">
                          <p className="text-emerald-400 flex items-center gap-2">
                            <FaMoneyBillWave /> Budget: PKR{" "}
                            {task.price?.toLocaleString()}
                          </p>
                          <p className="text-gray-300 flex items-center gap-2">
                            <FaMapMarkerAlt /> Location: {task.location}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setIsDrawerOpen(true);
                          }}
                          className="mt-5 w-full flex items-center justify-center gap-2
                                     bg-gradient-to-r from-emerald-600 to-green-600 
                                     text-white font-semibold py-2.5 rounded-xl 
                                     hover:from-emerald-500 hover:to-green-500
                                     hover:scale-[1.03] hover:shadow-lg transition-all"
                        >
                          <FaGavel className="text-lg" /> Place Bid
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">🙅‍♂️ No matching tasks found.</p>
            )}

            {/* ✅ Drawer for Bidding */}
            <BidDrawer
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              onSubmit={handleBidSubmit}
              selectedTask={selectedTask}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default MainPage;
