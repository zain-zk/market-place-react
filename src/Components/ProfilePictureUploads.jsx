import React, { useContext, useState } from "react";
import axios from "axios";
import { notifyError, notifySuccess } from "../utils/toast";
import userContext from "../contexts/userContext";

export default function ProfilePictureUpload({
  profilePic,
  setProfilePic,
  userId,
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Instant local preview
    const objectUrl = URL.createObjectURL(file);
    setProfilePic?.(objectUrl);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);

      const { data } = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/users/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // ✅ Use backend Cloudinary URL
      setProfilePic(data.avatarUrl);

      // ✅ Store avatar in localStorage so Sidebar can always load it
      localStorage.setItem("avatarUrl", data.avatarUrl);

      // ✅ Update user object in localStorage
      // localStorage.setItem(
      //   JSON.stringify({ ...user, avatarUrl: data.avatarUrl })
      //   "user",
      // );

      // 🔔 Dispatch custom event so Sidebar updates immediately
      window.dispatchEvent(new Event("avatarUpdated"));

      notifySuccess("Profile picture updated successfully ✅");
    } catch (error) {
      console.error("Upload error:", error);
      notifyError(
        error.response?.data?.message || "Failed to upload profile picture ❌"
      );

      // Revert to old avatar if exists
      // const user = JSON.parse(localStorage.getItem("user"));
      const { user } = useContext(userContext);
      if (user?.avatarUrl) {
        setProfilePic(user.avatarUrl);
      }
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        id="profileUpload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <label
        htmlFor="profileUpload"
        className="relative group w-64 h-64 rounded-xl overflow-hidden border-2 border-green-600 cursor-pointer"
      >
        {profilePic ? (
          <img
            src={profilePic}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
            No photo
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <span className="text-white text-sm">
            {uploading ? "Uploading…" : "Change Photo"}
          </span>
        </div>
      </label>
    </div>
  );
}
