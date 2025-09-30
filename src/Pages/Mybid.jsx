// src/pages/MyBidsPage.jsx
import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import { Link } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaUserTie,
  FaMapMarkerAlt,
  FaTrash,
} from "react-icons/fa";
import { MdOutlineDateRange, MdChat } from "react-icons/md";
import { notifySuccess } from "../utils/toast";
import axiosInstance from "../utils/axiosInstance";
import userContext from "../contexts/userContext";

const MyBidsPage = () => {
  const { user } = useContext(userContext);
  const [myBids, setMyBids] = useState([]);
  const providerId = user?._id || user?.id;
  const role = user?.role || "service-provider";

  // theme status chips
  const statusColors = {
    Pending: "bg-yellow-400 text-black",
    Accepted: "bg-blue-500 text-white",
    Declined: "bg-red-500 text-white",
  };

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axiosInstance.get("/bids/my-bids", {
          params: { provider: providerId },
        });
        setMyBids(res.data);
      } catch (err) {
        console.error("Error fetching bids:", err);
      }
    };
    fetchBids();
  }, [providerId]);

  const handleWithdraw = async (bidId) => {
    try {
      await axiosInstance.delete(`/bids/${bidId}`);
      setMyBids((prevBids) => prevBids.filter((bid) => bid._id !== bidId));
      notifySuccess("Bid withdrawn successfully ✅");
    } catch (error) {
      console.error("FAILED TO DELETE BID", error);
    }
  };

  const handleChat = (clientName, task) => {
    notifySuccess(`Opening chat with ${clientName} for "${task}"`);
  };

  return (
    <div className="  bg-black text-gray-100">
      <Sidebar role={role} />

      <main className="flex-1 p-8 ">
        <h1 className="text-4xl font-extrabold mb-10 mt-13  text-blue-400 text-center">
          My Bids 📑
        </h1>

        {myBids.length === 0 ? (
          <p className="text-gray-400 text-center">
            You haven’t placed any bids yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myBids.map((bid) => (
              <div
                key={bid._id}
                className=" rounded-2xl border border-blue-700 shadow-lg hover:shadow-blue-400/30 hover:border-blue-400 transition-all duration-300 p-6 flex flex-col justify-between"
              >
                {/* Task & Client Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-300">
                      {bid.requirement?.category || "Untitled Task"}
                    </h2>
                    <h3 className="text-1xl font-bold text-white mb-2 flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold
                      ${
                        bid.requirement?.status === "Pending"
                          ? "bg-yellow-500"
                          : bid.requirement?.status === "Active"
                          ? "bg-blue-600"
                          : bid.requirement?.status === "Completed"
                          ? "bg-green-500 "
                          : "bg-green-700"
                      }`}
                      >
                        {bid.requirement?.status}
                      </span>
                    </h3>
                  </div>

                  <h4 className="text-1xl font-bold text-blue-300">
                    {bid.requirement?.title || "Untitled Task"}
                  </h4>

                  <p className="text-gray-300 text-sm flex items-center gap-2">
                    <FaUserTie className="text-blue-400" />
                    <span className="font-semibold text-white">
                      Client:
                    </span>{" "}
                    {bid.requirement?.client?.name || "Unknown"}
                  </p>

                  <p className="text-gray-300 text-sm flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-400" />
                    <span className="font-semibold text-white">
                      Location:
                    </span>{" "}
                    {bid.requirement?.location || "Unknown"}
                  </p>

                  <p className="text-gray-300 text-sm flex items-center gap-2">
                    <FaMoneyBillWave className="text-yellow-400" />
                    <span className="font-semibold text-white">
                      Budget:
                    </span>{" "}
                    PKR {bid.requirement?.price || "Unknown"}
                  </p>

                  <p className="text-gray-300 text-sm flex items-center gap-2">
                    <FaMoneyBillWave className="text-emerald-400" />
                    <span className="font-semibold text-white">
                      Your Bid:
                    </span>{" "}
                    PKR {bid.amount}
                  </p>

                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <MdOutlineDateRange className="text-gray-500" />
                    {new Date(bid.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Status & Actions */}
                <div className="flex justify-between items-center">
                  <span
                    className={`px-4 py-1 rounded-full font-bold text-xs tracking-wide shadow-sm ${
                      statusColors[bid.status]
                    }`}
                  >
                    {bid.status}
                  </span>

                  {bid.status === "Pending" && (
                    <button
                      onClick={() => handleWithdraw(bid._id)}
                      className="relative inline-flex items-center gap-2 px-4 py-2 overflow-hidden font-semibold text-white rounded-xl group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg transition-all duration-300"
                    >
                      <span className="absolute right-0 w-8 h-32 -mt-12 transition-transform duration-500 rotate-12 translate-x-12 bg-white opacity-10 group-hover:-translate-x-40 ease"></span>
                      <FaTrash /> Withdraw
                    </button>
                  )}

                  {bid.status === "Accepted" &&
                    bid.requirement?.status === "Active" && (
                      <Link
                        to={`/chat/${bid.requirement?.client?._id}/${bid._id}`}
                        onClick={() =>
                          handleChat(
                            bid.requirement?.client?.name,
                            bid.requirement?.title
                          )
                        }
                        className="relative inline-flex items-center gap-2 px-4 py-2 overflow-hidden font-semibold text-white rounded-xl group bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-600 shadow-lg transition-all duration-300"
                      >
                        <span className="absolute right-0 w-8 h-32 -mt-12 transition-transform duration-500 rotate-12 translate-x-12 bg-white opacity-10 group-hover:-translate-x-40 ease"></span>
                        <MdChat /> Chat
                      </Link>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBidsPage;
