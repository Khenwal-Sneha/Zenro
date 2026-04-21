import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";
import SuccessAlert from "../components/SuccessAlert";

export default function CreateListingPage() {
  const navigate = useNavigate();

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFormData({ ...formData, img: file });

      // 🔥 image preview
      setPreview(URL.createObjectURL(file));
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

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key === "img" ? "image" : key, value as any);
      });

      await api.post("/listings", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setSuccessMsg("Listing created successfully!");
      navigate("/");
    } catch (err: any) {
      if (err?.response?.status === 401) {
        navigate("/login");
        setErrorMsg("Please login to create a listing");
      } else {
        setErrorMsg(
          err?.response?.data?.message || "Failed to create listing"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div
        className="
          max-w-3xl mx-auto
          bg-white/70 backdrop-blur-lg
          border border-gray-200
          rounded-2xl p-6 sm:p-8
          shadow-sm
        "
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Alerts */}
        <div className="mb-6 space-y-3">
          <ErrorAlert message={errorMsg} />
          <SuccessAlert message={successMsg} />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
          List Your Space on Zenro
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TITLE */}
          <div className="relative">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <label className="absolute left-4 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm transition-all">
              Title *
            </label>
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                Please give your listing a title!
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="relative">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <label className="absolute left-4 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm transition-all">
              Description
            </label>
          </div>

          {/* IMAGE */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Upload Image *
            </label>

            <input
              type="file"
              onChange={handleFileChange}
              className="mt-2 text-sm file:px-4 file:py-2 file:rounded-xl file:bg-teal-600 file:text-white hover:file:bg-teal-700"
            />

            {/* 🔥 PREVIEW */}
            {preview && (
              <img
                src={preview}
                className="mt-4 rounded-xl w-full h-52 object-cover border"
              />
            )}

            {errors.img && (
              <p className="text-red-500 text-sm mt-1">
                Please upload an image!
              </p>
            )}
          </div>

          {/* PRICE + COUNTRY */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="relative">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 focus:ring-2 focus:ring-teal-500"
              />
              <label className="absolute left-4 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm transition-all">
                Price *
              </label>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  Enter valid price!
                </p>
              )}
            </div>

            <div className="relative">
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 focus:ring-2 focus:ring-teal-500"
              />
              <label className="absolute left-4 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm transition-all">
                Country *
              </label>
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">
                  Enter country!
                </p>
              )}
            </div>
          </div>

          {/* LOCATION */}
          <div className="relative">
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 focus:ring-2 focus:ring-teal-500"
            />
            <label className="absolute left-4 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm transition-all">
              Location *
            </label>
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                Enter location!
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-gradient-to-r from-teal-600 to-teal-500
              text-white font-medium
              py-3 rounded-xl
              shadow-md hover:shadow-lg
              hover:scale-[1.02]
              transition-all duration-200
            "
          >
            {loading ? "Creating..." : "Publish on Zenro"}
          </button>

        </form>
      </motion.div>
    </Layout>
  );
}