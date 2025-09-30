// src/components/BidDrawer.jsx
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { notifySuccess } from "../utils/toast";
import userContext from "../contexts/userContext";
import axiosInstance from "../utils/axiosInstance";
import Sidebar from "../Components/Sidebar";
import {
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaUserTie,
  FaArrowLeft,
  FaComments,
  FaTrash,
} from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";

const statusColors = {
  Pending: "bg-yellow-400 text-black",
  Accepted: "bg-blue-600 text-white",
  Declined: "bg-red-500 text-white",
};

export default function BidDrawer() {
  const navigate = useNavigate();
  const { user } = useContext(userContext);
  const location = useLocation();
  const { bid } = location.state || {};
  const selectedTask = location.state?.task || bid?.requirement || {};

  const [existingBids, setExistingBids] = useState([]);

  // filter only this task's bids
  const reqbids = existingBids.filter(
    (bid) => bid?.requirement?._id === selectedTask?._id
  );

  useEffect(() => {
    if (user?._id && (selectedTask?._id || bid?._id)) {
      (async () => {
        try {
          const requirementId = selectedTask?._id || bid?.requirement?._id;
          const res = await axiosInstance.get("/bids/my-bids", {
            params: { provider: user._id, requirement: requirementId },
          });
          setExistingBids(res.data);
        } catch (err) {
          console.error("Error fetching existing bids:", err);
        }
      })();
    }
  }, [selectedTask?._id, user?._id, bid?._id]);

  // ✅ Withdraw function
  const handleWithdraw = async (bidId) => {
    try {
      await axiosInstance.delete(`/bids/${bidId}`);
      setExistingBids((prev) => prev.filter((b) => b._id !== bidId));
      notifySuccess("Bid withdrawn successfully ✅");
    } catch (error) {
      console.error("FAILED TO DELETE BID", error);
      alert("Failed to withdraw bid. Try again.");
    }
  };

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
      notifySuccess("Bid placed successfully!");
      setExistingBids((prev) => [...prev, response.data]);
      e.target.reset();
    } catch (error) {
      console.error("Error submitting bid:", error.response?.data || error);
      alert("Failed to submit bid. Please try again.");
    }
  };

  // ✅ Counters
  const acceptedCount = reqbids.filter((b) => b.status === "Accepted").length;
  const pendingCount = reqbids.filter((b) => b.status === "Pending").length;
  const declinedCount = reqbids.filter((b) => b.status === "Declined").length;

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <Sidebar />
      {/* Header */}
      <header className="bg-black sticky top-0 z-10">
        <div className="flex justify-between items-center px-6 py-4 mt-16">
          <h2 className="text-2xl font-bold flex flex-1 justify-center text-blue-400">
            Job Details & Place Bid
          </h2>
          <button
            onClick={() => navigate("/main/provider")}
            className="flex items-center gap-2 cursor-pointer text-white hover:text-blue-400 transition"
          >
            <FaArrowLeft /> Back
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Job Detail Section */}
        <div className="rounded-2xl bg-black border border-blue-800/40 shadow p-6 space-y-4">
          <h3 className="text-3xl font-bold text-blue-400">
            {selectedTask?.category || "Untitled Task"}
          </h3>
          <p className="text-gray-300 text-lg">
            Title: {selectedTask?.title || "No description provided."}
          </p>
          <p className="text-gray-300 text-lg">
            Description:{" "}
            {selectedTask?.description || "No description provided."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
            <div className="flex items-center gap-3">
              <FaUserTie className="text-blue-400 text-xl" />
              <div>
                <p className="font-semibold text-gray-400">Client</p>
                <p className="text-white">
                  {selectedTask?.client?.name || "Unknown"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-blue-400 text-xl" />
              <div>
                <p className="font-semibold text-gray-400">Location</p>
                <p className="text-white">{selectedTask?.location || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaMoneyBillWave className="text-blue-400 text-xl" />
              <div>
                <p className="font-semibold text-gray-400">Budget</p>
                <p className="text-white">PKR {selectedTask?.price || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MdOutlineDateRange className="text-blue-400 text-xl" />
              <div>
                <p className="font-semibold text-gray-400">Posted On</p>
                <p className="text-white">
                  {selectedTask?.createdAt
                    ? new Date(selectedTask?.createdAt).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "short", day: "numeric" }
                      )
                    : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Status Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-xl bg-blue-600/20 border border-blue-600 p-6 text-center">
            <h4 className="text-2xl font-bold text-blue-400">
              {acceptedCount}
            </h4>
            <p className="text-gray-300">Accepted Bids</p>
          </div>
          <div className="rounded-xl bg-yellow-400/20 border border-yellow-400 p-6 text-center">
            <h4 className="text-2xl font-bold text-yellow-400">
              {pendingCount}
            </h4>
            <p className="text-gray-300">Pending Bids</p>
          </div>
          <div className="rounded-xl bg-red-600/20 border border-red-600 p-6 text-center">
            <h4 className="text-2xl font-bold text-red-400">{declinedCount}</h4>
            <p className="text-gray-300">Declined Bids</p>
          </div>
        </div>

        {/* Place Bid Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-2xl bg-black border border-blue-800/40 shadow p-6"
        >
          <h4 className="text-3xl font-bold text-blue-400">Place Your Bid</h4>

          <div>
            <label className="block text-sm font-medium mb-1">
              Bid Amount (PKR)
            </label>
            <input
              type="number"
              name="amount"
              placeholder="Enter your bid"
              required
              className="w-full border border-blue-800 rounded-lg px-4 py-2 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
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
              className="w-full border border-blue-800 rounded-lg px-4 py-2 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
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
              className="w-full border border-blue-800 rounded-lg px-4 py-2 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:scale-[1.02] transition"
          >
            Submit Bid
          </button>
        </form>

        {/* Existing Bids */}
        {reqbids.length > 0 && (
          <div className="rounded-2xl bg-black border border-blue-800/40 shadow p-6 space-y-4">
            <h4 className="text-3xl font-bold text-blue-400">
              Your Bid Status
            </h4>
            <div className="overflow-x-auto">
              <div className="min-w-[700px] grid grid-cols-4 bg-blue-800/60 text-white font-semibold px-4 py-3 rounded-t-xl">
                <span>Amount</span>
                <span>Proposal</span>
                <span>Status</span>
                <span>Action</span>
              </div>
              {reqbids.map((bid) => (
                <div
                  key={bid._id}
                  className="min-w-[700px] grid grid-cols-4 items-center bg-black border-b border-blue-800/40 px-4 py-4 hover:bg-blue-950/30 transition"
                >
                  <span className="font-semibold text-white">
                    PKR {bid.amount}
                  </span>
                  <span className="text-gray-300 truncate max-w-[200px]">
                    {bid.proposal || "-"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-center text-sm font-semibold ${
                      statusColors[bid.status]
                    }`}
                  >
                    {bid.status}
                  </span>

                  {/* ✅ Actions */}
                  <div className="flex items-center gap-3">
                    {bid.status === "Pending" && (
                      <button
                        onClick={() => handleWithdraw(bid._id)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 transition flex items-center gap-2"
                      >
                        <FaTrash /> Withdraw
                      </button>
                    )}
                    {bid.status === "Accepted" && (
                      <Link
                        to={`/chat/${selectedTask?.client?._id}/${bid._id}`}
                        className="px-8 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:scale-[1.02] transition flex items-center justify-center"
                      >
                        <FaComments />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
