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
  const role = propRole || user?.role;
  const userId = user?._id || user?.id;

  // client states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // provider states
  const [requirements, setRequirements] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Sargodha"];

  useEffect(() => {
    if (role === "provider") fetchRequirements();
  }, [role]);

  const fetchRequirements = async () => {
    try {
      setLoadingTasks(true);
      const res = await axiosInstance.get("/requirements");
      if (res.status === 200) setRequirements(res.data);
    } catch (err) {
      console.error("❌ Server error:", err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const filteredTasks = requirements.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.location.toLowerCase().includes(searchTerm.toLowerCase());
    const cityMatch = selectedCity
      ? task.location?.toLowerCase().includes(selectedCity.toLowerCase())
      : true;
    return matchesSearch && cityMatch;
  });

  const handlePostRequirement = async (e) => {
    e.preventDefault();
    if (!title || !description || !price || !location) {
      notifyInfo("⚠️ Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/requirements",
        { client: userId, title, description, price, location },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200) {
        notifySuccess("✅ Requirement posted successfully!");
        setTitle("");
        setDescription("");
        setPrice("");
        setLocation("");
        navigate("/postedtasks");
      } else notifyInfo(res.data.message || "❌ Something went wrong");
    } catch (err) {
      console.error(err);
      notifyError("❌ Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <main className="flex-1 pt-20 px-4 p-8 bg-gradient-to-br ">
        {role === "client" ? (
          // CLIENT SIDE
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                {/* Client */}
              </h1>
              <p className="text-gray-300 text-lg mt-4">
                Post your Jobs and connect with top service providers.
              </p>
            </div>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br  
                border border-blue-700/40 backdrop-blur-xl 
                p-6 sm:p-10 rounded-3xl shadow-2xl hover:shadow-blue-900/30 transition"
            >
              <h2 className="text-2xl font-semibold text-blue-400 mb-8 text-center">
                Post a New Job
              </h2>
              <form onSubmit={handlePostRequirement} className="grid gap-7">
                <input
                  type="text"
                  placeholder="Requirement Title"
                  className="w-full p-4 rounded-xl bg-black/70 border border-blue-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Describe your requirement in detail..."
                  rows="5"
                  className="w-full p-4 rounded-xl bg-transparent border border-blue-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <input
                    type="number"
                    placeholder="Budget (PKR)"
                    className="w-full p-4 rounded-xl bg-black/70 border border-blue-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location (e.g. Karachi)"
                    className="w-full p-4 rounded-xl bg-black/70 border border-blue-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-block cursor-pointer bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 
                      text-white px-10 py-4 rounded-xl font-semibold shadow-md hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {loading ? "Posting..." : "Post This Job"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        ) : (
          // PROVIDER SIDE
          <div className="flex flex-col items-center w-full px-4">
            <h1 className="text-4xl font-bold mb-3 text-blue-400 flex items-center gap-2 text-center">
              Explore Jobs Posted <MdWork className="text-blue-300" />
            </h1>
            <p className="text-gray-300 mb-8 text-center text-lg">
              Find tasks that match your skills and place your bids to get
              started ✨
            </p>

            <div className="w-full max-w-5xl mb-8">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by profession, city or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800/50 text-gray-200 border border-gray-600/30 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-lg"
                />
              </div>
            </div>

            <div className="flex gap-2 mb-10 flex-wrap justify-center">
              <button
                onClick={() => setSelectedCity("")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedCity === ""
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-600"
                }`}
              >
                All Cities
              </button>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCity === city
                      ? "bg-blue-600 text-white"
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
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
                {filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className="relative backdrop-blur-xl 
              border border-blue-700/100 rounded-3xl p-8 hover:border-blue-500/50 
              hover:shadow-2xl hover:shadow-blue-500/20 group-hover:scale-[1.02] group-hover:-translate-y-1 transition"
                  >
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      {task.title} 📋
                    </h2>
                    <p className="text-gray-300 mb-4">{task.description}</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-blue-400 flex items-center gap-2">
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
                             bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-2.5 rounded-xl 
                             hover:from-blue-500 hover:to-blue-400 hover:scale-[1.03] hover:shadow-lg transition-all"
                    >
                      <FaGavel className="text-lg" /> Place Bid
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">🙅‍♂️ No matching tasks found.</p>
            )}
          </div>
        )}
      </main>
      <BidDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={() => {}}
        selectedTask={selectedTask}
      />
    </div>
  );
};

export default MainPage;
