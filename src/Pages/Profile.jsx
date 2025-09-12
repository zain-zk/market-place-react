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

  // ✅ Fetch Profile (backend gets userId from token)
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
          localStorage.setItem("avatarUrl", data.avatarUrl); // ✅ cache avatar
        }
      } catch (err) {
        console.error("Error fetching profile", err);
        notifyError("Failed to load profile ❌");
      }
    }
    fetchProfile();
  }, []);

  // ✅ Handle Update
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
      <div className="flex items-center justify-center min-h-screen text-green-300">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-green-950 to-black text-black overflow-hidden flex-1 lg:ml-64 pt-20 lg:pt-2 p-2">
      {/* Sidebar with profile picture */}
      <Sidebar role={user.role || "client"} profilePic={profilePic} />

      {/* Main */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="w-full bg-green-900/20 border-b p-5 border-green-800 shadow-lg">
          <h1 className="text-3xl font-extrabold text-green-400 tracking-wide">
            My Profile
          </h1>
        </header>

        <section className="flex-1 flex items-center justify-center p-8 relative">
          <div className="w-full max-w-5xl flex relative overflow-hidden">
            {/* Profile Card */}
            <div
              className={`flex-1 bg-green-900/20 backdrop-blur-lg border border-green-800 rounded-2xl shadow-2xl p-10 md:flex md:gap-12 items-center transition-transform duration-500 ${
                isEditing
                  ? "-translate-x-1/3 opacity-70 scale-95"
                  : "translate-x-0 opacity-100 scale-100"
              }`}
            >
              {/* Avatar */}
              <div className="relative flex flex-col items-center">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-green-700 to-green-900 border-4 border-green-500 flex items-center justify-center text-5xl font-bold text-green-300 shadow-xl overflow-hidden">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span className="absolute -bottom-4 bg-green-500 text-black text-xs font-bold px-4 py-1 rounded-full shadow-md">
                  {user.role === "client" ? "Client 👤" : "Service 🛠"}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-row">
                <div className="flex-1 mt-12 md:mt-0 space-y-5 text-gray-400">
                  <h2 className="text-4xl font-semibold text-green-400">
                    {user.name}
                  </h2>
                  <p className="flex items-center gap-3">
                    <FiMail className="text-green-400 text-lg" />
                    {user.email}
                  </p>
                  <p className="flex items-center gap-3">
                    <FiPhone className="text-green-400 text-lg" />
                    {user.phone || "Not provided"}
                  </p>
                  <p className="flex items-center gap-3">
                    <FiBriefcase className="text-green-400 text-lg" />
                    {user.company || "No company"}
                  </p>
                  <p className="flex items-center gap-3">
                    <FiAward className="text-green-400 text-lg" />
                    {user.skill || "No skills"} - {user.experience || "0 yrs"}
                  </p>
                  <p className="flex items-center gap-3">
                    <FiMapPin className="text-green-400 text-lg" />
                    {user.location || "Unknown"}
                  </p>
                  <p className="flex items-center gap-3">
                    <FiCalendar className="text-green-400 text-lg" />
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-6 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:scale-105"
                  >
                    <FiEdit /> Edit Profile
                  </button>
                </div>

                {/* ✅ Upload picture */}
                <div className="text-white flex ml-40 items-center">
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
              className={`absolute right-0 top-0 h-full w-full max-w-2xl bg-green-950 border-1 border-green-700 p-8 rounded-l-2xl shadow-2xl transform transition-transform duration-500 ${
                isEditing ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <h2 className="text-2xl font-bold text-green-400 mb-6">
                Edit Profile
              </h2>
              <form
                onSubmit={handleUpdate}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="p-3 rounded-lg bg-black border border-green-700 text-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="p-3 rounded-lg bg-black border border-green-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="p-3 rounded-lg bg-black border border-green-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  className="p-3 rounded-lg bg-black border border-green-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Skill"
                  value={form.skill}
                  onChange={(e) => setForm({ ...form, skill: e.target.value })}
                  className="p-3 rounded-lg bg-black border border-green-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Experience"
                  value={form.experience}
                  onChange={(e) =>
                    setForm({ ...form, experience: e.target.value })
                  }
                  className="p-3 rounded-lg bg-black border border-green-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="p-3 rounded-lg bg-black border border-green-700 text-white"
                />

                <div className="col-span-2 flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
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
