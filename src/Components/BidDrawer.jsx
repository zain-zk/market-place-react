// src/Components/BidDrawer.jsx
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { notifySuccess } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import userContext from "../contexts/userContext";

const BidDrawer = ({ isOpen, onClose, onSubmit, selectedTask }) => {
  if (!isOpen) return null;
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // ✅ get logged-in user from localStorage
    const bidData = {
      provider: user?._id, // logged-in provider
      requirementId: selectedTask?._id, // task being bid on
      amount: Number(formData.get("amount")),
      proposal: formData.get("proposal"),
      deliveryTime: Number(formData.get("deliveryTime")),
    };

    try {
      const response = await axios.post(
        ` ${import.meta.env.VITE_BACKEND_URL}/api/bids`,
        bidData
      );
      onSubmit(response.data); // send back to parent
      {
        notifySuccess("Bid placed successfully!");
      }
      onClose();
      navigate("/my-bids");
    } catch (error) {
      console.error(
        "Error submitting bid:",
        error.response?.data || error.message
      );
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
            className="fixed top-0 right-0 h-full w-full sm:w-1/3 bg-[#e3e7e4]  shadow-2xl z-50 rounded-l-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b  border-gray-200">
              <h2 className="text-lg font-semibold text-green-700">
                Place Your Bid on {selectedTask?.title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Bid Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 p-6 flex-grow overflow-y-auto"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bid Amount (PKR)
                </label>
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter your bid"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 
                             focus:outline-none focus:ring-2 focus:ring-green-600 
                             focus:border-green-600 transition shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposal / Notes (optional)
                </label>
                <textarea
                  name="proposal"
                  rows="3"
                  placeholder="Write a short proposal..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 
                             focus:outline-none focus:ring-2 focus:ring-green-600 
                             focus:border-green-600 transition shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time (Hours)
                </label>
                <input
                  type="number"
                  name="deliveryTime"
                  placeholder="e.g., 5"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 
                             focus:outline-none focus:ring-2 focus:ring-green-600 
                             focus:border-green-600 transition shadow-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2.5 rounded-xl 
                           shadow hover:bg-green-700 transition font-medium"
              >
                Submit Bid
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BidDrawer;
