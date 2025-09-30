import React from "react";
import LoginPage from "./Pages/Login";
import Register from "./Pages/Register";
import Role from "./Pages/Role";
import Dashboard from "./Pages/Dashboard";
import MainPage from "./Pages/Main";
import PostedTasks from "./Pages/PostedTasks";
import Profile from "./Pages/Profile";
import Mybid from "./Pages/Mybid";
import ChatPage from "./Components/Chat";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./Components/PrivateRoutes";
import DashboardMain from "./Pages/DashboardMain";
import JobDetailsPage from "./Components/ViewBids";
import BidDrawer from "./Components/BidDrawer";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-role" element={<Role />} />
      <Route path="/register/:role" element={<Register />} />
      <Route
        path="/register"
        element={<Navigate to="/register-role" replace />}
      />

      {/* Protected routes */}
      <Route path="/" element={<Dashboard />} />
      <Route
        path="/main/client"
        element={
          <PrivateRoute allowedRoles={"client"}>
            <MainPage role="client" />
          </PrivateRoute>
        }
      />
      <Route
        path="/main/provider"
        element={
          <PrivateRoute allowedRoles={"provider"}>
            <MainPage role="provider" />
          </PrivateRoute>
        }
      />
      <Route
        path="/detail-bids"
        element={
          // <PrivateRoute>
          <BidDrawer />
          // </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/client"
        element={
          // <PrivateRoute allowedRoles={"provider"}>
          <DashboardMain role="client" />
          // </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/provider"
        element={
          // <PrivateRoute allowedRoles={"provider"}>
          <DashboardMain role="provider" />
          // {/* </PrivateRoute> */}
        }
      />
      <Route
        path="/requirements/:reqId/jobdetails"
        element={
          // <PrivateRoute allowedRoles={"provider"}>
          <JobDetailsPage />
          // </PrivateRoute>
        }
      />
      <Route
        path="/postedtasks"
        element={
          <PrivateRoute>
            <PostedTasks />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-bids"
        element={
          <PrivateRoute>
            <Mybid />
          </PrivateRoute>
        }
      />

      <Route
        path="/chat/:otherUserId/:bidId"
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
