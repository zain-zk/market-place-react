import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import EditRequirement from "../Components/EditRequirement";
import DropdownMenu from "../Components/DropdownMenu";
import { notifySuccess, notifyError } from "../utils/toast";
import userContext from "../contexts/userContext";
import axiosInstance from "../utils/axiosInstance";
import Sidebar from "../Components/Sidebar";
import { Link } from "react-router-dom";

const RequirementsPage = () => {
  const { user } = useContext(userContext);

  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edittingId, setEdittingId] = useState(null);

  const clientId = user?._id || user?.id;

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/requirements/my/${clientId}`);
        setRequirements(res.data);
      } catch {
        notifyError("Error loading your posted requirements");
      } finally {
        setLoading(false);
      }
    };
    if (clientId) fetchRequirements();
  }, [clientId]);

  const handleDeleteRequirement = async (reqId) => {
    if (!window.confirm("⚠️ Delete this requirement?")) return;
    try {
      await axiosInstance.delete(`/requirements/${reqId}`);
      setRequirements((prev) => prev.filter((r) => r._id !== reqId));
      notifySuccess("Requirement deleted");
    } catch {
      notifyError("Failed to delete requirement");
    }
  };

  const handleEditClick = (reqId) => setEdittingId(reqId);
  const handleCancelEdit = () => setEdittingId(null);

  const handleSaveEdit = async (id, updated) => {
    setRequirements((prev) => prev.map((r) => (r._id === id ? updated : r)));
    setEdittingId(null);
  };

  // ✅ mark a single requirement completed
  const handleMarkCompleted = async (reqId) => {
    try {
      const res = await axiosInstance.put(`/requirements/${reqId}/status`, {
        status: "Completed",
      });
      setRequirements((prev) =>
        prev.map((r) => (r._id === reqId ? res.data : r))
      );
      notifySuccess("Requirement marked as completed");
    } catch {
      notifyError("Failed to update status");
    }
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
            <div className="h-6 bg-gray-600 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Sidebar />

      <main className="flex-1 mt-14 sm:mt-12 relative">
        <div className="relative z-10 p-4 sm:p-8">
          {/* Header */}
          <div className=" flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-500 mb-2">
                My Requirements
              </h1>
              <p className="text-gray-400 text-base sm:text-lg">
                Manage and track your posted project requirements
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-4 sm:p-6 min-w-[160px] sm:min-w-[200px]"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-500">
                  {requirements.length}
                </div>
                <div className="text-gray-200 text-sm">Active</div>
              </div>
            </motion.div>
          </div>

          {/* Cards */}
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
                    className="relative w-full min-h-[32rem] sm:min-h-[26rem] "
                  >
                    {/* Front side */}
                    <div
                      className="absolute inset-0 sm:mt-4 "
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className=" border border-gray-700 rounded-3xl p-6 sm:p-8 h-full hover:border-blue-500 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 group-hover:scale-[1.02] group-hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-4 sm:mb-6">
                          <div className="flex-1">
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-2">
                              {req.category}
                            </h3>
                            <div className="w-16 h-1 bg-blue-500 rounded-full"></div>
                          </div>
                          <span
                            className={`inline-block px-5 py-1 mr-2 mt-2 rounded-full text-xs font-semibold 
                          ${
                            req.status === "Pending"
                              ? "bg-yellow-600"
                              : req.status === "Active"
                              ? "bg-blue-600"
                              : req.status === "Completed"
                              ? "bg-green-500"
                              : "bg-green-600"
                          }`}
                          >
                            {req.status}
                          </span>
                          {(req.status === "Active" ||
                            req.status === "Pending") && (
                            <DropdownMenu
                              onDelete={() => handleDeleteRequirement(req._id)}
                              onEdit={() => handleEditClick(req._id)}
                              onComplete={
                                req.status !== "Completed"
                                  ? () => handleMarkCompleted(req._id)
                                  : null
                              }
                            />
                          )}
                        </div>
                        <h3 className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 line-clamp-3 ">
                          {req.title}
                        </h3>
                        <p className="">{/* {req.description} */}</p>

                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex items-center justify-between py-2 px-3 sm:py-3 sm:px-4 bg-gray-800 rounded-xl border border-gray-700">
                            <span className="text-gray-200 font-medium text-sm sm:text-base">
                              Budget
                            </span>
                            <span className="text-blue-500 font-bold text-base sm:text-lg">
                              PKR {req.price?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-2 px-3 sm:py-3 sm:px-4 bg-gray-800 rounded-xl border border-gray-700">
                            <span className="text-gray-200 font-medium text-sm sm:text-base">
                              Location
                            </span>
                            <span className="text-blue-500 font-medium text-sm sm:text-base">
                              {req.location}
                            </span>
                          </div>
                        </div>

                        <div className="mt-8 sm:mt-8  flex flex-col gap-3">
                          <Link
                            to={`/requirements/${req._id}/jobdetails`}
                            className="block text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                          >
                            View Bids
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Back side for editing */}
                    <div
                      className="absolute inset-0"
                      style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {edittingId === req._id && (
                        <div className=" border border-gray-700 rounded-3xl p-4 sm:p-6">
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
              <p className="text-gray-400">No requirements posted yet.</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RequirementsPage;
