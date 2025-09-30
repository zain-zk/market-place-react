import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaClock,
  FaDollarSign,
  FaCheck,
  FaBan,
  FaComments,
  FaArrowLeft,
} from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import { notifyError } from "../utils/toast";
import Sidebar from "../Components/Sidebar";

// Status pill colors
const statusColors = {
  Pending: "bg-yellow-400 text-black",
  Accepted: "bg-blue-600 text-white",
  Declined: "bg-red-500 text-white",
};

const JobDetailsPage = () => {
  const { reqId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobAndBids = async () => {
      try {
        setLoading(true);
        const jobRes = await axiosInstance.get(`/requirements/${reqId}`);
        setJob(jobRes.data);
        const bidsRes = await axiosInstance.get(
          `/bids/requirements/${reqId}/bids`
        );
        setBids(bidsRes.data || []);
      } catch (err) {
        console.error(err);
        notifyError("Error loading job details");
      } finally {
        setLoading(false);
      }
    };
    if (reqId) fetchJobAndBids();
  }, [reqId]);

  const handleUpdateStatus = async (bidId, status) => {
    try {
      await axiosInstance.put(`/bids/${bidId}/status`, { status });
      setBids((prev) =>
        prev.map((b) => (b._id === bidId ? { ...b, status } : b))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-300 bg-black h-screen flex items-center justify-center">
        Loading…
      </p>
    );
  if (!job)
    return (
      <p className="text-center text-red-500 bg-black h-screen flex items-center justify-center">
        Job not found
      </p>
    );

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-black text-gray-200">
        {/* Header */}
        <header className="bg-black sticky top-0 z-10 mt-16">
          <div className="flex justify-end px-4 py-4">
            <button
              onClick={() => navigate("/postedtasks")}
              className="flex items-center gap-2 cursor-pointer text-white hover:text-blue-400 transition"
            >
              <FaArrowLeft /> Back to My Requirements
            </button>
          </div>
        </header>

        {/* Summary boxes */}
        <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 px-4">
          <div className="rounded-2xl bg-black border border-blue-800/40 p-6 text-center">
            <p className="text-sm text-gray-400">Total Bids</p>
            <p className="text-3xl font-bold text-blue-400">{bids.length}</p>
          </div>
          <div className="rounded-2xl bg-black border border-blue-800/40 p-6 text-center">
            <p className="text-sm text-gray-400">Pending</p>
            <p className="text-3xl font-bold text-yellow-400">
              {bids.filter((b) => b.status === "Pending").length}
            </p>
          </div>
          <div className="rounded-2xl bg-black border border-blue-800/40 p-6 text-center">
            <p className="text-sm text-gray-400">Declined</p>
            <p className="text-3xl font-bold text-red-400">
              {bids.filter((b) => b.status === "Declined").length}
            </p>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Job Info */}
          <section className="rounded-2xl bg-black border border-blue-800/40 shadow p-8 mb-10">
            <h1 className="text-4xl font-bold text-blue-400 mb-4">
              {job.category}
            </h1>
            <h3 className="text-2xl font-bold text-blue-300 mb-4">
              {job.title}
            </h3>
            <p className="text-gray-300 text-lg mb-8">{job.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base">
              <div className="flex items-center gap-3">
                <FaDollarSign className="text-blue-400 text-2xl" />
                <div>
                  <p className="font-semibold text-gray-400">Budget</p>
                  <p className="text-white text-lg">PKR {job.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-blue-400 text-2xl" />
                <div>
                  <p className="font-semibold text-gray-400">Location</p>
                  <p className="text-white text-lg">{job.location}</p>
                </div>
              </div>
              {job.category && (
                <div>
                  <p className="font-semibold text-gray-400">Category</p>
                  <p className="text-white text-lg">{job.category}</p>
                </div>
              )}
              {job.createdAt && (
                <div>
                  <p className="font-semibold text-gray-400">Posted On</p>
                  <p className="text-white text-lg">
                    {new Date(job.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Bids */}
          <h2 className="text-3xl font-bold text-blue-400 mb-6">
            Providers Bids
          </h2>

          {bids.length === 0 ? (
            <p className="text-gray-400">No bids yet 😔</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[800px] grid grid-cols-6 bg-blue-800/60 text-white font-semibold px-4 py-3 rounded-t-xl">
                <span>Provider</span>
                <span>Delivery Time</span>
                <span>Proposal</span>
                <span>Amount</span>
                <span>Status</span>
                <span className="text-center">Actions</span>
              </div>

              {bids.map((bid) => (
                <div
                  key={bid._id}
                  className="min-w-[800px] grid grid-cols-6 items-center bg-black border-b border-blue-800/40 px-4 py-4 hover:bg-blue-950/30 transition"
                >
                  <div className="flex items-center gap-2">
                    <FaUser className="text-blue-400 text-lg" />
                    <span className="font-medium">
                      {bid.provider?.name || "Unknown"}
                    </span>
                  </div>

                  <span className="text-gray-300">{bid.deliveryTime} hrs</span>

                  <span className="text-gray-300 truncate max-w-[200px]">
                    {bid.proposal || "-"}
                  </span>

                  <span className="font-semibold text-white">
                    PKR {bid.amount}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-center text-sm font-semibold ${
                      statusColors[bid.status]
                    }`}
                  >
                    {bid.status}
                  </span>

                  <div className="flex justify-center gap-3">
                    {bid.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateStatus(bid._id, "Accepted")
                          }
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:scale-[1.02] transition"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(bid._id, "Declined")
                          }
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-800 text-white hover:scale-[1.02] transition"
                        >
                          <FaBan />
                        </button>
                      </>
                    )}
                    {bid.status === "Accepted" && (
                      <button
                        onClick={() =>
                          navigate(`/chat/${bid.provider?._id}/${bid._id}`)
                        }
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:scale-[1.02] transition"
                      >
                        <FaComments />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default JobDetailsPage;
