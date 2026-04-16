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
      
      navigate("/");
      setSuccessMsg("Listing created successfully!");

    } catch (err: any) {
      if (err?.response?.status === 401) {
        navigate("/login");
        setErrorMsg("Please login to create a listing");
      } else {
        setErrorMsg(err?.response?.data?.message || "Failed to create listing");
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
    bg-white border border-gray-200
    rounded-2xl p-8
    shadow-sm
  "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-4">
  <ErrorAlert message={errorMsg} />
  <SuccessAlert message={successMsg} />
</div>
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
          List Your Space on Zenro
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title<span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="
          w-full mt-2
          border border-gray-300
          rounded-xl px-4 py-2.5
          focus:outline-none
          focus:ring-2 focus:ring-teal-500
          focus:border-transparent
        "
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                Please give your listing a title!
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="
          w-full mt-2
          border border-gray-300
          rounded-xl px-4 py-2.5
          focus:outline-none
          focus:ring-2 focus:ring-teal-500
          focus:border-transparent
        "
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Image<span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="img"
              onChange={handleFileChange}
              className="
          mt-2 text-sm text-gray-600
          file:mr-4 file:px-4 file:py-2
          file:rounded-xl file:border-0
          file:bg-teal-600 file:text-white
          hover:file:bg-teal-700
          transition
        "
            />
            {errors.img && (
              <p className="text-red-500 text-sm mt-1">
                Please upload an image!
              </p>
            )}
          </div>

          {/* Price + Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="
            w-full mt-2
            border border-gray-300
            rounded-xl px-4 py-2.5
            focus:outline-none
            focus:ring-2 focus:ring-teal-500
            focus:border-transparent
          "
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  Enter valid price!
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country<span className="text-red-500">*</span>
              </label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="
            w-full mt-2
            border border-gray-300
            rounded-xl px-4 py-2.5
            focus:outline-none
            focus:ring-2 focus:ring-teal-500
            focus:border-transparent
          "
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">
                  Enter country!
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location<span className="text-red-500">*</span>
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="
          w-full mt-2
          border border-gray-300
          rounded-xl px-4 py-2.5
          focus:outline-none
          focus:ring-2 focus:ring-teal-500
          focus:border-transparent
        "
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                Enter location!
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
        w-full
        bg-teal-600 hover:bg-teal-700
        text-white font-medium
        py-3 rounded-xl
        shadow-sm hover:shadow-md
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