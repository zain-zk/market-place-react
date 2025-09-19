import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaUser,
  FaClock,
  FaDollarSign,
  FaFileAlt,
  FaCheck,
  FaBan,
  FaComments,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const statusColors = {
  Pending: "bg-yellow-400 text-black",
  Accepted: "bg-green-500 text-white",
  Declined: "bg-red-500 text-white",
};

const ViewBidsModal = ({ isOpen, onClose, bids, onUpdateStatus }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                       w-full max-w-2xl bg-gradient-to-br from-black to-green-950 
                       rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-green-700/50">
              <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
                📋 Bids Received
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              {bids.length === 0 ? (
                <p className="text-gray-400 text-center">
                  No bids placed yet 😔
                </p>
              ) : (
                bids.map((bid) => (
                  <div
                    key={bid._id}
                    className="bg-green-900/30 border border-green-700/40 
                               rounded-xl p-5 hover:shadow-lg hover:shadow-green-600/20 
                               transition transform hover:-translate-y-1"
                  >
                    {/* Header Row */}
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <FaUser className="text-green-400" />
                        {bid.provider?.name || "Unknown Provider"}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[bid.status]
                        }`}
                      >
                        {bid.status}
                      </span>
                    </div>

                    {/* Bid Details */}
                    <div className="space-y-2 text-gray-300 text-sm mb-4">
                      <p className="flex items-center gap-2">
                        <FaDollarSign className="text-green-400" />
                        Bid Amount:{" "}
                        <span className="font-semibold text-white">
                          PKR {bid.amount}
                        </span>
                      </p>

                      <p className="flex items-center gap-2">
                        <FaClock className="text-green-400" />
                        Delivery Time:{" "}
                        <span className="font-semibold text-white">
                          {bid.deliveryTime} hrs
                        </span>
                      </p>

                      {bid.proposal && (
                        <p className="flex items-start gap-2">
                          <FaFileAlt className="text-green-400 mt-1" />
                          <span>{bid.proposal}</span>
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {bid.status === "Pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => onUpdateStatus(bid._id, "Accepted")}
                          className="flex-1 flex items-center justify-center gap-2 
                                     bg-green-600 hover:bg-green-700 
                                     text-white font-medium py-2 px-4 rounded-lg 
                                     transition shadow-md hover:shadow-green-500/30"
                        >
                          <FaCheck /> Accept
                        </button>
                        <button
                          onClick={() => onUpdateStatus(bid._id, "Declined")}
                          className="flex-1 flex items-center justify-center gap-2 
                                     bg-red-600 hover:bg-red-700 
                                     text-white font-medium py-2 px-4 rounded-lg 
                                     transition shadow-md hover:shadow-red-500/30"
                        >
                          <FaBan /> Decline
                        </button>
                      </div>
                    )}

                    {/* ✅ Chat Button for Accepted Bids */}
                    {bid.status === "Accepted" && (
                      <div className="mt-3">
                        <button
                          onClick={() =>
                            navigate(`/chat/${bid.provider?._id}/${bid._id}`)
                          }
                          className="w-full flex items-center justify-center gap-2 
                              bg-blue-600 hover:bg-blue-700 
                              text-white font-medium py-2 px-4 rounded-lg 
                              transition shadow-md hover:shadow-blue-500/30"
                        >
                          <FaComments /> Chat with{" "}
                          {bid.provider?.name || "Provider"}
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ViewBidsModal;
