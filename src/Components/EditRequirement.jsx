import { FaSave } from "react-icons/fa";
import { useState, useEffect } from "react";
import { notifySuccess } from "../utils/toast";

const EditRequirement = ({ req, onSave, onCancel, setEdittingId }) => {
  const [title, setTitle] = useState(req.title);
  const [description, setDescription] = useState(req.description);
  const [price, setPrice] = useState(req.price);
  const [location, setLocation] = useState(req.location);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(req.title);
    setDescription(req.description);
    setPrice(req.price);
    setLocation(req.location);
  }, [req]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/requirements/${req._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            price,
            location,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();

      onSave(req._id, updated);
      notifySuccess("Requirement Updated Successfully");
      setEdittingId(false);
    } catch (error) {
      console.error("Error updating requirement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(req.title);
    setDescription(req.description);
    setPrice(req.price);
    setLocation(req.location);
    setEdittingId(false);
    if (onCancel) onCancel();
  };

  return (
    <div className="w-full ">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
        ✏️ Edit Requirement
      </h3>

      <label className="text-sm text-gray-300 mb-1 block">📌 Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 rounded-lg bg-black/50 border border-green-700 text-white mb-3"
        placeholder="Enter title"
      />

      <label className="text-sm text-gray-300 mb-1 block">📝 Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 rounded-lg bg-black/50 border border-green-700 text-white mb-2 resize-none"
        rows={2}
        placeholder="Write description"
      />

      {/* Budget & Location grid now responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1 block">
            💰 Budget (PKR)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 rounded-lg bg-black/50 border border-green-700 text-white"
            placeholder="PKR"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1 block">
            📍 Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 rounded-lg bg-black/50 border border-green-700 text-white"
            placeholder="City"
          />
        </div>
      </div>

      {/* Buttons stack on mobile */}
      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <button
          disabled={loading}
          onClick={handleSave}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 
                     px-4 py-2 rounded-lg font-semibold text-white 
                     flex items-center justify-center gap-2 transition"
        >
          <FaSave /> {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 bg-gray-500 hover:bg-gray-400 
                     px-4 py-2 rounded-lg font-semibold text-white 
                     flex items-center justify-center gap-2 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditRequirement;
