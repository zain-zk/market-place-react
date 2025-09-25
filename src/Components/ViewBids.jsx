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

const statusColors = {
  Pending: "bg-yellow-400 text-black",
  Accepted: "bg-green-500 text-white",
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
    return <p className="text-center text-gray-500 mt-10">Loading…</p>;
  if (!job)
    return <p className="text-center text-red-500 mt-10">Job not found</p>;

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50">
        {/* Header with back button */}
        <header className="bg-white shadow sticky top-0 z-10 mt-16">
          <div className="">
            <div className="flex justify-end  px-4 py-4">
              <button
                onClick={() => navigate("/postedtasks")}
                className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-green-700 transition"
              >
                <FaArrowLeft /> Back to My Requirements
              </button>
            </div>
            <div className="space-x-4 flex justify-center">
              {/* <h1 className="text-lg font-semibold text-green-700 ">
                Job Detail
              </h1> */}
            </div>
          </div>
        </header>

        {/* Three summary boxes */}
        <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 px-4">
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500">Total Bids</p>
            <p className="text-3xl font-bold text-green-700">{bids.length}</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">
              {bids.filter((b) => b.status === "Pending").length}
            </p>
          </div>
          {/* <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-3xl font-bold text-yellow-600">
              {bids.filter((b) => b.status === "chat").length}
            </p>
          </div> */}
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500">Declined</p>
            <p className="text-3xl font-bold text-red-600">
              {bids.filter((b) => b.status === "Declined").length}
            </p>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Expanded Job Info */}
          <section className="bg-white rounded-2xl shadow p-8 mb-10">
            <h1 className="text-4xl font-bold text-green-700 mb-4">
              {job.title}
            </h1>
            <p className="text-gray-700 text-lg mb-8">{job.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-800 text-base">
              <div className="flex items-center gap-3">
                <FaDollarSign className="text-green-600 text-2xl" />
                <div>
                  <p className="font-semibold text-gray-600">Budget</p>
                  <p className="text-gray-900 text-lg">PKR {job.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-green-600 text-2xl" />
                <div>
                  <p className="font-semibold text-gray-600">Location</p>
                  <p className="text-gray-900 text-lg">{job.location}</p>
                </div>
              </div>
              {job.category && (
                <div>
                  <p className="font-semibold text-gray-600">Category</p>
                  <p className="text-gray-900 text-lg">{job.category}</p>
                </div>
              )}
              {job.createdAt && (
                <div>
                  <p className="font-semibold text-gray-600">Posted On</p>
                  <p className="text-gray-900 text-lg">
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

          {/* Providers Bids */}
          <h2 className="text-3xl font-bold text-green-700 mb-6">
            Providers Bids
          </h2>

          {bids.length === 0 ? (
            <p className="text-gray-500">No bids yet 😔</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[800px] grid grid-cols-6 bg-green-600 text-white font-semibold px-4 py-3 rounded-t-xl">
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
                  className="min-w-[800px] grid grid-cols-6 items-center bg-white border-b border-gray-200 px-4 py-4 hover:bg-gray-50 transition"
                >
                  {/* Provider */}
                  <div className="flex items-center gap-2">
                    <FaUser className="text-green-600 text-lg" />
                    <span className="font-medium">
                      {bid.provider?.name || "Unknown"}
                    </span>
                  </div>

                  {/* Delivery */}
                  <span className="text-gray-700">{bid.deliveryTime} hrs</span>

                  {/* Proposal */}
                  <span className="text-gray-700 truncate max-w-[200px]">
                    {bid.proposal || "-"}
                  </span>

                  {/* Amount */}
                  <span className="font-semibold text-gray-900">
                    PKR {bid.amount}
                  </span>

                  {/* Status */}
                  <span
                    className={`px-3 py-1 rounded-full text-center text-sm font-semibold ${
                      statusColors[bid.status]
                    }`}
                  >
                    {bid.status}
                  </span>

                  {/* Actions */}
                  <div className="flex justify-center gap-3">
                    {bid.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateStatus(bid._id, "Accepted")
                          }
                          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(bid._id, "Declined")
                          }
                          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500"
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
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
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
