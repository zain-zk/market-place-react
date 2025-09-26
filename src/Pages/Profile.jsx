// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit,
  FiBriefcase,
  FiAward,
} from "react-icons/fi";
import ProfilePictureUpload from "../Components/ProfilePictureUploads";
import { notifyError, notifySuccess } from "../utils/toast";
import axiosInstance from "../utils/axiosInstance";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    skill: "",
    experience: "",
    location: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await axiosInstance.get("/users/profile");
        setUser(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          company: data.company || "",
          skill: data.skill || "",
          experience: data.experience || "",
          location: data.location || "",
        });

        if (data.avatarUrl) {
          setProfilePic(data.avatarUrl);
          localStorage.setItem("avatarUrl", data.avatarUrl);
        }
      } catch (err) {
        console.error("Error fetching profile", err);
        notifyError("Failed to load profile ❌");
      }
    }
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.put("/users/profile", form);
      setUser(data);
      setIsEditing(false);
      notifySuccess("Profile updated successfully ✅");
    } catch (err) {
      console.error("Error updating profile", err);
      notifyError("Failed to update profile ❌");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-300 bg-black">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-gray-200">
      {/* Sidebar */}
      <Sidebar role={user.role || "client"} profilePic={profilePic} />

      {/* MAIN */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="w-full bg-black  p-5  mt-14">
          <h1 className="text-3xl font-extrabold text-blue-400 tracking-wide text-center">
            My Profile
          </h1>
        </header>

        {/* Content */}
        <section className="flex-1 flex items-center justify-center p relative">
          <div className="w-full max-w-5xl flex flex-col md:flex-row relative overflow-hidden">
            {/* Profile Card */}
            <div
              className={`flex-1 bg-black border border-blue-800/40 rounded-2xl shadow-sm hover:shadow-md p-6 md:p-10 flex flex-col md:flex-row md:gap-12 items-center md:items-start transition-transform duration-500 ${
                isEditing
                  ? "-translate-x-1/3 opacity-70 scale-95"
                  : "translate-x-0 opacity-100 scale-100"
              }`}
            >
              {/* Avatar */}
              <div className="relative mt-22 flex flex-col items-center">
                <div className="w-40 h-40 rounded-full bg-gray-900 border-4 border-blue-500 flex items-center justify-center text-5xl font-bold text-blue-400 shadow overflow-hidden">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span className="absolute -bottom-4 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                  {user.role === "client" ? "Client 👤" : "Service 🛠"}
                </span>
              </div>

              {/* Info + Upload */}
              <div className="flex flex-col md:flex-row md:flex-1 ml-7 w-full md:space-x-10 mt-6 md:mt-0">
                <div className="flex-1 space-y-3 md:space-y-5 text-gray-300">
                  <h2 className="text-2xl md:text-4xl font-semibold text-blue-400">
                    {user.name}
                  </h2>
                  <p className="flex items-center gap-3">
                    <FiMail className="text-blue-400 text-lg" />
                    {user.email}
                  </p>
                  <p className="flex items-center gap-3">
                    <FiPhone className="text-blue-400 text-lg" />
                    {user.phone || "Not provided"}
                  </p>
                  <p className="flex items-center gap-3">
                    <FiBriefcase className="text-blue-400 text-lg" />
                    {user.company || "No company"}
                  </p>
                  <p className="flex items-center gap-3">
                    <FiAward className="text-blue-400 text-lg" />
                    {user.skill || "No skills"} - {user.experience || "0 yrs"}
                  </p>
                  <p className="flex items-center gap-3">
                    <FiMapPin className="text-blue-400 text-lg" />
                    {user.location || "Unknown"}
                  </p>
                  <p className="flex items-center gap-3">
                    <FiCalendar className="text-blue-400 text-lg" />
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 md:mt-6 flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold shadow hover:shadow-lg hover:scale-[1.02] transition"
                  >
                    <FiEdit /> Edit Profile
                  </button>
                </div>

                <div className="flex justify-center md:justify-end mt-6 md:mt-10 mr-30">
                  <ProfilePictureUpload
                    userId={user._id}
                    profilePic={profilePic}
                    setProfilePic={setProfilePic}
                  />
                </div>
              </div>
            </div>

            {/* Sliding Edit Form */}
            <div
              className={`absolute right-0 top-0 h-full w-full max-w-2xl bg-black border border-blue-800/40 p-6 md:p-8 rounded-l-2xl shadow transform transition-transform duration-500 ${
                isEditing ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <h2 className="text-xl md:text-2xl font-bold text-blue-400 mb-6">
                Edit Profile
              </h2>
              <form
                onSubmit={handleUpdate}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="p-3 rounded-lg bg-gray-950 border border-blue-700 text-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="p-3 rounded-lg bg-gray-950 border border-blue-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="p-3 rounded-lg bg-gray-950 border border-blue-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  className="p-3 rounded-lg bg-gray-950 border border-blue-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Skill"
                  value={form.skill}
                  onChange={(e) => setForm({ ...form, skill: e.target.value })}
                  className="p-3 rounded-lg bg-gray-950 border border-blue-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Experience"
                  value={form.experience}
                  onChange={(e) =>
                    setForm({ ...form, experience: e.target.value })
                  }
                  className="p-3 rounded-lg bg-gray-950 border border-blue-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="p-3 rounded-lg bg-gray-950 border border-blue-700 text-white"
                />

                <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4 md:mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 md:px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 md:px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold shadow hover:shadow-lg hover:scale-[1.02] transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
