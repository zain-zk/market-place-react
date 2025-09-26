import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { notifySuccess } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import userContext from "../contexts/userContext";
import axiosInstance from "../utils/axiosInstance";
import { FaMoneyBillWave, FaMapMarkerAlt, FaUserTie } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";

const BidDrawer = ({ isOpen, onClose, onSubmit, selectedTask }) => {
  if (!isOpen) return null;
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  // ✅ all bids already placed on this job
  const [existingBids, setExistingBids] = useState([]);

  useEffect(() => {
    if (selectedTask?._id && user?._id) {
      (async () => {
        try {
          const res = await axiosInstance.get("/bids/my-bids", {
            params: { provider: user._id, requirement: selectedTask._id },
          });
          setExistingBids(res.data);
        } catch (err) {
          console.error("Error fetching existing bids:", err);
        }
      })();
    }
  }, [selectedTask?._id, user?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const bidData = {
      provider: user?._id,
      requirementId: selectedTask?._id,
      amount: Number(formData.get("amount")),
      proposal: formData.get("proposal"),
      deliveryTime: Number(formData.get("deliveryTime")),
    };

    try {
      const response = await axiosInstance.post("/bids", bidData);
      onSubmit(response.data);
      notifySuccess("Bid placed successfully!");
      // refresh bids
      setExistingBids((prev) => [...prev, response.data]);
      e.target.reset();
    } catch (error) {
      console.error("Error submitting bid:", error.response?.data || error);
      alert("Failed to submit bid. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-full sm:w-1/3 bg-white text-gray-800 shadow-2xl z-50 rounded-l-2xl flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-green-700">
                Job Details & Place Bid
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 📝 Job Detail Section */}
              <div className="bg-green-50 rounded-xl p-5 space-y-3 shadow">
                <h3 className="text-lg font-semibold text-green-700">
                  {selectedTask?.title}
                </h3>
                <p className="text-sm text-gray-700">
                  {selectedTask?.description || "No description provided."}
                </p>
                <div className="text-sm space-y-1">
                  <p className="flex items-center gap-2">
                    <FaUserTie className="text-green-600" />
                    <span className="font-semibold">Client:</span>{" "}
                    {selectedTask?.client?.name || "Unknown"}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span className="font-semibold">Location:</span>{" "}
                    {selectedTask?.location || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-yellow-500" />
                    <span className="font-semibold">Budget:</span> PKR{" "}
                    {selectedTask?.price || "N/A"}
                  </p>
                  <p className="flex items-center gap-2 text-gray-500 text-xs">
                    <MdOutlineDateRange />{" "}
                    {selectedTask?.createdAt
                      ? new Date(selectedTask?.createdAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              </div>

              {/* 📝 Place Bid Form */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 bg-white border rounded-xl p-5 shadow"
              >
                <h4 className="text-lg font-semibold text-green-700">
                  Place Your Bid
                </h4>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Bid Amount (PKR)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="Enter your bid"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Proposal / Notes (optional)
                  </label>
                  <textarea
                    name="proposal"
                    rows="3"
                    placeholder="Write a short proposal..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Delivery Time (Hours)
                  </label>
                  <input
                    type="number"
                    name="deliveryTime"
                    placeholder="e.g., 5"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition"
                >
                  Submit Bid
                </button>
              </form>

              {/* 📝 Existing Bids Status */}
              {existingBids.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-5 shadow space-y-3">
                  <h4 className="text-lg font-semibold text-green-700">
                    Your Bid Status
                  </h4>
                  {existingBids.map((bid) => (
                    <div
                      key={bid._id}
                      className="flex justify-between items-center bg-white border rounded-lg px-4 py-2 text-sm"
                    >
                      <span>
                        PKR {bid.amount} - {bid.proposal || "No proposal"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          bid.status === "Pending"
                            ? "bg-yellow-400 text-black"
                            : bid.status === "Accepted"
                            ? "bg-blue-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {bid.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BidDrawer;
