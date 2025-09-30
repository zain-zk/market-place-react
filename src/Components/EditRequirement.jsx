import { FaSave } from "react-icons/fa";
import { useState, useEffect } from "react";
import { notifySuccess } from "../utils/toast";
import axiosInstance from "../utils/axiosInstance";

const EditRequirement = ({ req, onSave, onCancel, setEdittingId }) => {
  const [category, setCategory] = useState(req.category);
  const [title, setTitle] = useState(req.title);
  const [description, setDescription] = useState(req.description);
  const [price, setPrice] = useState(req.price);
  const [location, setLocation] = useState(req.location);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCategory(req.category);
    setTitle(req.title);
    setDescription(req.description);
    setPrice(req.price);
    setLocation(req.location);
  }, [req]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.put(`/requirements/${req._id}`, {
        category,
        title,
        description,
        price,
        location,
      });

      if (!res.status === 200) throw new Error("Failed to update");
      const updated = res.data;

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
    setCategory(req.category);
    setTitle(req.title);
    setDescription(req.description);
    setPrice(req.price);
    setLocation(req.location);
    setEdittingId(false);
    if (onCancel) onCancel();
  };

  return (
    <div className="w-full  mb-1 ">
      <h3 className="text-lg sm:text-xl  font-bold text-white sm:mb-1  flex items-center gap-2">
        ✏️ Edit Requirement
      </h3>
      <label className="block text-sm text-gray-400 mb-1">
        Select or Enter Category
      </label>
      <input
        list="categories"
        placeholder="Type or select category (e.g. Plumber)"
        className="w-full p-2 rounded-xl bg-black/70 border border-blue-700 text-white placeholder-gray-500 focus focus:ring-blue-500"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <datalist id="categories">
        <option value="Plumber" />
        <option value="Labour" />
        <option value="Carpenter" />
        <option value="Electrician" />
        <option value="Painter" />
      </datalist>

      <label className="text-sm text-gray-300 mb-1 block">📌 Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 rounded-lg bg-black/50 border border-blue-700 text-white mb-1"
        placeholder="Enter title"
      />
      <label className="text-sm text-gray-300 mb-1 block">📝 Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 rounded-lg bg-black/50 border border-blue-700 text-white mb- resize-none"
        rows={1}
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
            className="w-full p-2 rounded-lg bg-black/50 border border-blue-700 text-white"
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
            className="w-full p-2 rounded-lg bg-black/50 border border-blue-700 text-white"
            placeholder="City"
          />
        </div>
      </div>

      {/* Buttons stack on mobile */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          disabled={loading}
          onClick={handleSave}
          className="flex-1 bg-blue-600 hover:bg-blue-500 
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
