import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";
import SuccessAlert from "../components/SuccessAlert";

type Listing = {
  _id: string;
  title: string;
  description: string;
  price: number;
  country: string;
  location: string;
  image?: { url: string };
};

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [editlist, setEditlist] = useState<Listing | null>(null);

  const [preview, setPreview] = useState<string | null>(null);
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
    price: false,
    country: false,
    location: false,
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        const data = res.data.data;

        setEditlist(data);

        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: String(data.price || ""),
          country: data.country || "",
          location: data.location || "",
          img: null,
        });
      } catch {
        setErrorMsg("Failed to load listing");
      } finally {
        setPageLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFormData({ ...formData, img: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {
      title: !formData.title,
      price: !formData.price || Number(formData.price) <= 0,
      country: !formData.country,
      location: !formData.location,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !editlist) return;

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key === "img" ? "image" : key, value as any);
      });

      await api.put(`/listings/${editlist._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg("Listing updated successfully!");

      setTimeout(() => {
        navigate(`/listings/${editlist._id}`);
      }, 1200);
    } catch {
      setErrorMsg("Failed to update listing");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-pulse text-gray-400 text-lg">
            Loading listing...
          </div>
        </div>
      </Layout>
    );
  }

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

        <h2 className="text-2xl font-semibold text-center mb-8">
          Refine Your Space
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TITLE */}
          <div className="relative">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border rounded-xl px-4 pt-5 pb-2 focus:ring-2 focus:ring-teal-500"
            />
            <label className="absolute left-4 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm transition">
              Title *
            </label>
          </div>

          {/* IMAGE COMPARISON */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Current</p>
              <img
                src={editlist?.image?.url}
                className="rounded-xl h-40 w-full object-cover border"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">New</p>
              <input type="file" onChange={handleFileChange} />
              {preview && (
                <img
                  src={preview}
                  className="mt-3 rounded-xl h-40 w-full object-cover border"
                />
              )}
            </div>
          </div>

          {/* PRICE + COUNTRY */}
          <div className="grid md:grid-cols-2 gap-6">
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="border rounded-xl px-4 py-2"
            />
            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="border rounded-xl px-4 py-2"
            />
          </div>

          {/* LOCATION */}
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border rounded-xl px-4 py-2"
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border rounded-xl px-4 py-2"
          />

          {/* SUBMIT */}
          <button
            disabled={loading}
            className="
              w-full
              bg-gradient-to-r from-teal-600 to-teal-500
              text-white py-3 rounded-xl
              hover:scale-[1.02]
              transition
            "
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>

        </form>
      </motion.div>
    </Layout>
  );
}