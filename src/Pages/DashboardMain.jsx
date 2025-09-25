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
import { useNavigate } from "react-router-dom";
import { FaClipboardList, FaTasks, FaCheckCircle } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import userContext from "../contexts/userContext";
import axiosInstance from "../utils/axiosInstance";

/* ---- Reusable UI ---- */
function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition ${className}`}
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
      className={`px-5 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow hover:shadow-lg hover:scale-[1.02] transition ${className}`}
    >
      {children}
    </button>
  );
}
/* --------------------- */

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  const [tasks, setTasks] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch tasks & requirements from API
  useEffect(() => {
    if (!user?._id) return;
    const fetchData = async () => {
      try {
        // adjust endpoints to your backend routes
        // const tasksRes = await axiosInstance.get(`/requirements`);
        // setTasks(tasksRes.data || []);

        const reqRes = await axiosInstance.get(`/requirements/my/${user._id}`);
        setRequirements(reqRes.data || []);
      } catch (err) {
        console.error("Dashboard load error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?._id]);

  const taskSummary = {
    active: tasks.filter((t) => t.status === "active").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    requirements: requirements.length,
  };

  const progressData = [
    { name: "Completed", value: taskSummary.completed, color: "#22c55e" },
    { name: "In Progress", value: taskSummary.active, color: "#3b82f6" },
    { name: "Pending", value: taskSummary.requirements, color: "#f59e0b" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* CLIENT DASHBOARD */}
      {user.role === "client" && (
        <div className="flex-1 p-8 space-y-10">
          <h1 className="text-4xl font-extrabold mt-14 text-gray-800">
            {user.name || "Client"}'s Dashboard
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="flex items-center gap-4">
                <FaTasks className="text-blue-500 text-3xl" />
                <div>
                  <h2 className="text-sm text-gray-500">Active Tasks</h2>
                  <p className="text-3xl font-extrabold text-blue-600 mt-1">
                    {taskSummary.active}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <FaCheckCircle className="text-green-500 text-3xl" />
                <div>
                  <h2 className="text-sm text-gray-500">Completed</h2>
                  <p className="text-3xl font-extrabold text-green-600 mt-1">
                    {taskSummary.completed}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <FaClipboardList className="text-yellow-500 text-3xl" />
                <div>
                  <h2 className="text-sm text-gray-500">Requirements</h2>
                  <p className="text-3xl font-extrabold text-yellow-600 mt-1">
                    {taskSummary.requirements}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Chart */}
          <Card>
            <CardContent>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Task Progress Overview
              </h2>
              <div className="h-80">
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

          {/* Latest Requirements Section */}
          <Card>
            <CardContent>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Latest Job's Posted
              </h2>
              <div className="space-y-4">
                {requirements.slice(0, 3).map((req) => (
                  <div
                    key={req._id}
                    className="bg-gray-100 p-5 rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-lg text-gray-700">
                        {req.title}
                      </p>
                      <span className="text-sm text-gray-500">
                        Posted on{" "}
                        {new Date(req.createdAt).toLocaleDateString("en-US")}
                      </span>
                    </div>
                    <Button
                      onClick={() =>
                        navigate(`/requirements/${req._id}/jobdetails`)
                      }
                      className="px-4 py-1 text-sm cursor-pointer "
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-6  ">
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
          <h1 className="text-4xl font-extrabold mt-14 text-gray-800">
            {user.name || "Provider"}'s Dashboard
          </h1>

          {/* you can tweak provider dashboard content here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* same cards */}
            <Card>
              <CardContent className="flex items-center gap-4">
                <FaTasks className="text-blue-500 text-3xl" />
                <div>
                  <h2 className="text-sm text-gray-500">Active Tasks</h2>
                  <p className="text-3xl font-extrabold text-blue-600 mt-1">
                    {taskSummary.active}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <FaCheckCircle className="text-green-500 text-3xl" />
                <div>
                  <h2 className="text-sm text-gray-500">Completed</h2>
                  <p className="text-3xl font-extrabold text-green-600 mt-1">
                    {taskSummary.completed}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <FaClipboardList className="text-yellow-500 text-3xl" />
                <div>
                  <h2 className="text-sm text-gray-500">Requirements</h2>
                  <p className="text-3xl font-extrabold text-yellow-600 mt-1">
                    {taskSummary.requirements}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card>
            <CardContent>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Task Progress Overview
              </h2>
              <div className="h-80">
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
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
