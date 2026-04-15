import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateListingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    country: "",
    location: "",
    img: null as File | null,
  });

  const [errors, setErrors] = useState({
    title: false,
    img: false,
    price: false,
    country: false,
    location: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        img: e.target.files[0],
      });
    }
  };

  const validate = () => {
    const newErrors = {
      title: !formData.title,
      img: !formData.img,
      price: !formData.price || Number(formData.price) <= 0,
      country: !formData.country,
      location: !formData.location,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validate()) return;
  
    // ✅ FIX: DO NOT use localStorage
    // just rely on backend session/cookie auth
  
    setLoading(true);
  
    try {
      const data = new FormData();
  
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("country", formData.country);
      data.append("location", formData.location);
  
      if (formData.img) {
        data.append("image", formData.img);
      }
  
      const res = await api.post("/listings", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // IMPORTANT
      });
  
      alert("Listing created successfully!");
      navigate("/");
  
    } catch (err: any) {
      if (err?.response?.status === 401) {
        alert("Please login to create a listing");
        navigate("/login");
      } else {
        alert(err?.response?.data?.message || "Failed to create listing");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout>
      <motion.div
        className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_30px_rgba(99,102,241,0.15)]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-semibold mb-8 text-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          List Your Space on Zenro
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="font-medium text-gray-300">
              Title<span className="text-red-400">*</span>
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">
                Please give your listing a title!
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="font-medium text-gray-300">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Image */}
          <div>
            <label className="font-medium text-gray-300">
              Upload Image<span className="text-red-400">*</span>
            </label>
            <input
              type="file"
              name="img"
              onChange={handleFileChange}
              className="mt-2 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 transition"
            />
            {errors.img && (
              <p className="text-red-400 text-sm mt-1">
                Please upload an image!
              </p>
            )}
          </div>

          {/* Price + Country */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="font-medium text-gray-300">
                Price<span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full mt-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.price && (
                <p className="text-red-400 text-sm mt-1">
                  Enter valid price!
                </p>
              )}
            </div>

            <div>
              <label className="font-medium text-gray-300">
                Country<span className="text-red-400">*</span>
              </label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full mt-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.country && (
                <p className="text-red-400 text-sm mt-1">
                  Enter country!
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="font-medium text-gray-300">
              Location<span className="text-red-400">*</span>
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.location && (
              <p className="text-red-400 text-sm mt-1">
                Enter location!
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            {loading ? "Creating..." : "Publish on Zenro"}
          </button>
        </form>
      </motion.div>
    </Layout>
  );
}