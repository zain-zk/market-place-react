// src/pages/RequirementsPage.jsx
import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { motion } from "framer-motion";
import ViewBidsModal from "../Components/ViewBids";
import EditRequirement from "../Components/EditRequirement";
import DropdownMenu from "../Components/DropdownMenu";
import { notifyError, notifyInfo } from "../utils/toast";
import userContext from "../contexts/userContext";

const RequirementsPage = () => {
  const { user } = useContext(userContext);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = user?.role || "client";
  const clientId = user?._id || user?.id;

  const [isBidsOpen, setIsBidsOpen] = useState(false);
  const [selectedBids, setSelectedBids] = useState([]);
  const [edittingId, setEdittingId] = useState(null);

  console.log(user);
  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/requirements/my/${clientId}`
        );
        setRequirements(res.data);
      } catch (err) {
        notifyError("Error loading your posted requirements");
      } finally {
        setLoading(false);
      }
    };
    if (clientId) fetchRequirements();
  }, [clientId]);

  const handleViewBids = async (requirementId) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/bids/requirements/${requirementId}/bids`
      );
      setSelectedBids(res.data);
      setIsBidsOpen(true);
    } catch (err) {
      console.error("Error fetching bids:", err);
      notifyInfo("Failed to load bids");
    }
  };

  const handleUpdateStatus = async (bidId, newStatus) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/bids/${bidId}/status`,
        { status: newStatus }
      );
      setSelectedBids((prevBids) =>
        prevBids.map((b) =>
          b._id === bidId ? { ...b, status: res.data.status } : b
        )
      );
    } catch (error) {
      console.error("FAILED TO UPDATE STATUS", error);
    }
  };

  const handleDeleteRequirement = async (reqId) => {
    if (!window.confirm("⚠️ Delete this requirement?")) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/requirements/${reqId}`
      );
      setRequirements((prev) => prev.filter((r) => r._id !== reqId));
    } catch (err) {
      console.error("FAILED TO DELETE REQUIREMENT", err);
      notifyError("Failed to delete requirement");
    }
  };

  const handleEditClick = (reqId) => setEdittingId(reqId);
  const handleCancelEdit = () => setEdittingId(null);
  const handleSaveEdit = async (id, updated) => {
    setRequirements((prev) => prev.map((r) => (r._id === id ? updated : r)));
    setEdittingId(null);
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-green-900/20 rounded-2xl p-6 border border-green-700/30">
            <div className="h-6 bg-green-700/30 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-green-700/20 rounded w-3/4"></div>
              <div className="h-4 bg-green-700/20 rounded w-1/2"></div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-green-700/20 rounded w-2/3"></div>
              <div className="h-4 bg-green-700/20 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen  bg-gradient-to-br from-black to-green-950 flex flex-col lg:flex-row">
      {/* Sidebar - top on mobile, side on large screens */}
      <div className="w-full lg:w-64 flex-shrink-0 pt-12 md:pt-12 scroll-m-2">
        <Sidebar role={role} />
      </div>

      {/* Main Content */}
      <main className="flex-1 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40  bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%3E%3Ccircle%20cx=%227%22%20cy=%227%22%20r=%221%22%20fill=%22%23065f46%22%20fill-opacity=%220.05%22%2F%3E%3C%2Fsvg%3E')]"></div>

        <div className="relative z-10 p-4 sm:p-6 lg:p-10">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent mb-2">
                My Requirements
              </h1>
              <p className="text-gray-400 text-base sm:text-lg">
                Manage and track your posted project requirements
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-emerald-900/30 to-green-900/20 backdrop-blur-lg 
                border border-emerald-700/40 rounded-2xl p-4 sm:p-6 min-w-[160px] sm:min-w-[200px]"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400">
                  {requirements.length}
                </div>
                <div className="text-gray-300 text-sm">Active</div>
              </div>
            </motion.div>
          </div>

          {/* Content */}
          {loading ? (
            <LoadingSkeleton />
          ) : requirements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {requirements.map((req, index) => (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative"
                >
                  <motion.div
                    animate={{ rotateY: edittingId === req._id ? 180 : 0 }}
                    transition={{ duration: 1 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="relative w-full min-h-[32rem]  sm:min-h-[25rem]"
                  >
                    {/* Front side */}
                    <div
                      className="absolute inset-0"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div
                        className="bg-gradient-to-br from-gray-900/80 to-black/60 bgcard backdrop-blur-xl 
                        border border-emerald-700/30 rounded-3xl p-6 sm:p-8 h-full
                        hover:border-emerald-500/50 transition-all duration-500
                        hover:shadow-2xl hover:shadow-emerald-500/20
                        group-hover:scale-[1.02] group-hover:-translate-y-1"
                      >
                        <div className="flex items-start justify-between mb-4 sm:mb-6">
                          <div className="flex-1">
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-2">
                              {req.title}
                            </h3>
                            <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-green-300 rounded-full"></div>
                          </div>
                          <DropdownMenu
                            onDelete={() => handleDeleteRequirement(req._id)}
                            onEdit={() => handleEditClick(req._id)}
                          />
                        </div>

                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 line-clamp-3">
                          {req.description}
                        </p>

                        <div className="space-y-3 sm:space-y-4">
                          <div
                            className="flex items-center justify-between py-2 px-3 sm:py-3 sm:px-4 
                            bg-emerald-900/20 rounded-xl border border-emerald-700/20"
                          >
                            <span className="text-gray-400 font-medium text-sm sm:text-base">
                              Budget
                            </span>
                            <span className="text-emerald-600 font-bold text-base sm:text-lg">
                              PKR {req.price?.toLocaleString()}
                            </span>
                          </div>
                          <div
                            className="flex items-center justify-between py-2 px-3 sm:py-3 sm:px-4 
                            bg-gray-800/30 rounded-xl border border-gray-700/20"
                          >
                            <span className="text-gray-400 font-medium text-sm sm:text-base">
                              Location
                            </span>
                            <span className="text-gray-300 font-medium text-sm sm:text-base">
                              {req.location}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 sm:mt-8">
                          <button
                            onClick={() => handleViewBids(req._id)}
                            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 
                              hover:from-emerald-500 hover:to-green-500
                              text-white font-semibold py-2 sm:py-3 px-6 rounded-xl
                              transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
                          >
                            View Bids
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Back side */}
                    <div
                      className="absolute inset-0"
                      style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {edittingId && (
                        <div
                          className="bg-gradient-to-br bgcard from-gray-900/80 to-black/60 backdrop-blur-xl 
                        border border-emerald-700/100 rounded-3xl p-4 mb-7  sm:p-6 "
                        >
                          <EditRequirement
                            req={req}
                            onSave={handleSaveEdit}
                            onCancel={handleCancelEdit}
                            setEdittingId={setEdittingId}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center py-10"
            >
              <div className="relative">
                <div
                  className="w-24 h-24 sm:w-32 sm:h-32  bg-gradient-to-br from-emerald-900/30 to-green-900/20 
                    rounded-3xl flex items-center justify-center mb-6 sm:mb-8
                    border border-emerald-700/30 backdrop-blur-lg"
                >
                  <svg
                    className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-400/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="absolute -top-3 -right-3 w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                No Requirements Posted Yet
              </h3>
              <p className="text-gray-400 text-center max-w-md mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                Start by posting your first project requirement. Connect with
                talented service providers and bring your ideas to life.
              </p>
              <a
                href="/main/client"
                className="bg-gradient-to-r from-emerald-600 to-green-600 
                  hover:from-emerald-500 hover:to-green-500
                  text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl
                  transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25
                  hover:scale-105 text-sm sm:text-base"
              >
                Post Your First Requirement
              </a>
            </motion.div>
          )}
        </div>

        <ViewBidsModal
          isOpen={isBidsOpen}
          onClose={() => setIsBidsOpen(false)}
          bids={selectedBids}
          onUpdateStatus={handleUpdateStatus}
        />
      </main>
    </div>
  );
};

export default RequirementsPage;
