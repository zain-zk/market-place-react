// src/pages/ClientDashboard.jsx
import React, { useContext, useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { FaClipboardList, FaTasks, FaCheckCircle } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import userContext from "../contexts/userContext";
import axiosInstance from "../utils/axiosInstance";
import { notifyError } from "../utils/toast";

/* ---- Reusable UI ---- */
function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl bg-black border border-blue-800/40 shadow-sm hover:shadow-md transition ${className}`}
    >
      {children}
    </div>
  );
}
function CardContent({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
function Button({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium shadow hover:shadow-lg hover:scale-[1.02] transition ${className}`}
    >
      {children}
    </button>
  );
}
/* --------------------- */

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(userContext);
  const providerId = user?._id || user?.id;

  const [tasks, setTasks] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskSummary, setTaskSummary] = useState({
    active: 0,
    completed: 0,
    requirements: 0,
    declined: 0,
  });

  useEffect(() => {
    if (!user?._id) return;
    const fetchData = async () => {
      try {
        if (user.role === "client") {
          // fetch all requirements for this client
          const reqRes = await axiosInstance.get(
            `/requirements/my/${user._id}`
          );

          // 🔥 sort by createdAt descending (latest first)
          const sortedReqs = (reqRes.data || []).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setRequirements(sortedReqs);
          setTasks(sortedReqs); // if tasks are also requirements
        } else if (user.role === "provider") {
          // fetch all bids placed by this provider
          const bidsRes = await axiosInstance.get(`/bids/my-bids`, {
            params: { provider: providerId },
          });
          const bids = bidsRes.data || [];
          setMyBids(bids);
          // compute summary counts from bids
          setTaskSummary({
            active: bids.length,
            completed: bids.filter((b) => b.status === "Accepted").length,
            requirements: bids.filter((b) => b.status === "Pending").length,
            declined: bids.filter((b) => b.status === "Declined").length,
          });
        }
      } catch (err) {
        console.error("Dashboard load error", err);
        notifyError("Error loading dashboard data ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?._id, user?.role, providerId]);

  const clientSummary = {
    inprogress: requirements.length,
    Active: requirements.filter((r) => r.status === "Active").length,
    Completed: requirements.filter((r) => r.status === "Completed").length,
    Pending: requirements.filter((r) => r.status === "Pending").length,
  };

  const progressData =
    user?.role === "client"
      ? [
          {
            name: "InProgress",
            value: clientSummary.inprogress,
            color: "#06b6d4",
          },
          {
            name: "Completed",
            value: clientSummary.Completed,
            color: "#22c55e",
          },
          {
            name: "Active",
            value: clientSummary.Active,
            color: "#3b82f6",
          },
          {
            name: "Pending",
            value: clientSummary.Pending,
            color: "#f59e0b",
          },
        ]
      : [
          { name: "Bids", value: taskSummary.active, color: "#3B82F6" },
          {
            name: "Accepted Bids",
            value: taskSummary.completed,
            color: "#22C55E",
          },
          {
            name: "Pending Bids",
            value: taskSummary.requirements,
            color: "#FACC15",
          },
          {
            name: "Declined Bids",
            value: taskSummary.declined,
            color: "#AA0000",
          },
        ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-300 bg-black">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-gray-200">
      <Sidebar />

      {/* CLIENT DASHBOARD */}
      {user.role === "client" && (
        <div className="flex-1 p-8 space-y-10">
          <h1 className="text-4xl flex justify-center font-extrabold mt-14 text-white">
            {user.name || "Client"}'s Dashboard
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link to="/postedtasks">
              <Card>
                <CardContent className="flex items-center gap-4">
                  <FaSpinner className="text-cyan-400 animate-spin" size={24} />
                  <div>
                    <h2 className="text-sm text-gray-400">In Progress</h2>
                    <p className="text-3xl font-extrabold text-cyan-400 mt-1">
                      {clientSummary.inprogress}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Card>
              <CardContent className="flex items-center gap-4">
                <FaTasks className="text-blue-400 text-3xl" />
                <div>
                  <h2 className="text-sm text-gray-400">Active Tasks</h2>
                  <p className="text-3xl font-extrabold text-blue-400 mt-1">
                    {clientSummary.Active}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <FaCheckCircle className="text-green-400 text-3xl" />
                <div>
                  <h2 className="text-sm text-gray-400">Completed</h2>
                  <p className="text-3xl font-extrabold text-green-400 mt-1">
                    {clientSummary.Completed}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <FaClipboardList className="text-yellow-400 text-3xl" />
                <div>
                  <h2 className="text-sm text-gray-400">Pending</h2>
                  <p className="text-3xl font-extrabold text-yellow-400 mt-1">
                    {clientSummary.Pending}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Chart */}
          <Card>
            <CardContent>
              <h2 className="text-2xl font-bold text-white mb-6">
                Task Progress Overview
              </h2>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart
                    margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
                  >
                    <Pie
                      data={progressData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {progressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Latest Requirements */}
          <Card>
            <CardContent>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Latest Job's Posted
              </h2>
              <div className="space-y-4">
                {requirements.slice(0, 3).map((req) => (
                  <div
                    key={req._id}
                    className="bg-blue-950/40 p-5 rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-lg text-white">
                        {req.title}
                      </p>
                      <span className="text-sm text-gray-400">
                        Posted on{" "}
                        {new Date(req.createdAt).toLocaleDateString("en-US")}
                      </span>
                    </div>
                    <Button
                      onClick={() =>
                        navigate(`/requirements/${req._id}/jobdetails`)
                      }
                      className="px-4 py-1 text-sm register cursor-pointer "
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <Button
                  className="cursor-pointer"
                  onClick={() => navigate("/postedtasks")}
                >
                  See All Jobs Posted
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PROVIDER DASHBOARD */}
      {user.role === "provider" && (
        <div className="flex-1 p-8 space-y-10">
          <h1 className="text-4xl flex justify-center font-extrabold mt-14 text-white">
            {user.name || "Provider"}'s Dashboard
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link to="/my-bids">
              <Card>
                <CardContent className="flex items-center gap-4">
                  <FaTasks className="text-blue-400 text-3xl" />
                  <div>
                    <h2 className="text-sm text-gray-400">Bids</h2>
                    <p className="text-3xl font-extrabold text-blue-400 mt-1">
                      {taskSummary.active}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Card>
              <CardContent className="flex items-center gap-4">
                <FaCheckCircle className="text-green-400 text-3xl" />
                <div>
                  <h2 className="text-sm text-gray-400">Accepted Bids</h2>
                  <p className="text-3xl font-extrabold text-green-400 mt-1">
                    {taskSummary.completed}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <FaClipboardList className="text-yellow-400 text-3xl" />
                <div>
                  <h2 className="text-sm text-gray-400">Pending Bids</h2>
                  <p className="text-3xl font-extrabold text-yellow-400 mt-1">
                    {taskSummary.requirements}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <FaClipboardList className="text-red-800 text-3xl" />
                <div>
                  <h2 className="text-sm text-gray-400">Declined Bids</h2>
                  <p className="text-3xl font-extrabold text-red-800 mt-1">
                    {taskSummary.declined}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card>
            <CardContent>
              <h2 className="text-2xl font-bold text-white mb-6">
                Task Progress Overview
              </h2>
              <div className="h-90">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={progressData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {progressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* My Placed Bids */}
          <Card>
            <CardContent>
              <h2 className="text-2xl font-semibold text-white mb-6">
                My Placed Bids
              </h2>
              <div className="space-y-4">
                {myBids.length > 0 ? (
                  myBids.slice(0, 3).map((bid) => (
                    <div
                      key={bid._id}
                      className="bg-blue-950/40 p-5 rounded-xl flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-lg text-white">
                          Delivery Time {""}
                          {bid.deliveryTime} Hours
                        </p>
                        <span className="text-sm text-gray-400">
                          Placed on{" "}
                          {new Date(bid.createdAt).toLocaleDateString("en-US")}
                        </span>
                      </div>
                      <Button>
                        <Link
                          to="/detail-bids"
                          state={{
                            bid,
                            task: bid.requirement, // pass the related requirement
                          }}
                          className="px-4 py-1 register text-sm cursor-pointer  "
                        >
                          View
                        </Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">
                    You haven't placed any bids yet.
                  </p>
                )}
              </div>
              <div className="flex justify-center mt-6">
                <Button onClick={() => navigate("/my-bids")}>
                  See All My Bids
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
