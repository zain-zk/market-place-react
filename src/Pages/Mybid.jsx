// src/pages/MyBidsPage.jsx
import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaMoneyBillWave,
  FaUserTie,
  FaMapMarkerAlt,
  FaTrash,
} from "react-icons/fa";
import { MdOutlineDateRange, MdChat } from "react-icons/md";
import { notifyError, notifyInfo, notifySuccess } from "../utils/toast";
import userContext from "../contexts/userContext";

const MyBidsPage = () => {
  const [myBids, setMyBids] = useState([]);
  const { user } = useContext(userContext);
  const providerId = user?._id || user?.id;
  const role = user?.role || "service-provider";

  const statusColors = {
    Pending: "bg-yellow-400 text-black ",
    Accepted: "bg-green-500 text-white ",
    Declined: "bg-red-500 text-white",
  };

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bids/my-bids", {
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
      const res = await axios.delete(`http://localhost:5000/api/bids/${bidId}`);
      console.log("Bid deleted:", res.data);
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
    <div className="flex min-h-screen bg-black  text-white  flex-1  lg:ml-64 pt-20 lg:pt-2  p-4 ">
      <Sidebar role={role} />

      <main className="flex-1 p-10   bg-gradient-to-br from-black to-green-950">
        <h1 className="text-3xl font-bold mb-8 text-green-400">My Bids 📑</h1>

        {myBids.length === 0 ? (
          <p className="text-gray-400">No bids yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myBids.map((bid) => (
              <div
                key={bid._id}
                className="bg-gradient-to-br from-green-900 bgcard to-green-800 rounded-2xl shadow-xl p-6 flex flex-col justify-between border border-green-700 hover:border-green-400 hover:shadow-2xl transition-all duration-300"
              >
                {/* Task & Client Info */}
                <div className="space-y-3   mb-6">
                  <h2 className="text-2xl font-bold text-green-300">
                    {bid.requirement?.title || "Untitled Task"}
                  </h2>

                  <p className="text-gray-300 text-sm flex items-center gap-2">
                    <FaUserTie className="text-green-400" />
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
                      className="relative inline-flex items-center gap-2 px-5 py-2 overflow-hidden font-semibold text-white rounded-lg group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg transition-all duration-300"
                    >
                      <span className="absolute right-0 w-8 h-32 -mt-12 transition-transform duration-500 rotate-12 translate-x-12 bg-white opacity-10 group-hover:-translate-x-40 ease"></span>
                      <FaTrash /> Withdraw
                    </button>
                  )}

                  {bid.status === "Accepted" && (
                    <Link
                      to={`/chat/${bid.requirement?.client?._id}/${bid._id}`}
                      onClick={() =>
                        handleChat(
                          bid.requirement?.client?.name,
                          bid.requirement?.title
                        )
                      }
                      className="relative inline-flex items-center gap-2 px-5 py-2 overflow-hidden font-semibold text-white rounded-lg group bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-600 shadow-lg transition-all duration-300"
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
