import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

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
          price: data.price || "",
          country: data.country || "",
          location: data.location || "",
          img: null,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchListing();
  }, [id]);

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

    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", String(formData.price));
    data.append("country", formData.country);
    data.append("location", formData.location);

    if (formData.img) {
      data.append("img", formData.img);
    }

    try {
      setLoading(true);

      await api.put(`/listings/${editlist._id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Listing updated successfully!");
      window.location.href = `/listings/${editlist._id}`;
    } catch (err) {
      alert("Failed to update listing");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <Layout>
        <div className="text-center mt-20 text-gray-400">
          Loading...
        </div>
      </Layout>
    );
  }

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
  <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
    Refine Your Space on Zenro
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

    {/* Images */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Current Image
        </label>
        <img
          src={editlist?.image?.url || ""}
          className="
            mt-3 rounded-xl h-40 w-full object-cover
            border border-gray-200 shadow-sm
          "
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload New Image
        </label>
        <input
          type="file"
          name="img"
          onChange={handleFileChange}
          className="
            mt-3 text-sm text-gray-600
            file:mr-4 file:px-4 file:py-2
            file:rounded-xl file:border-0
            file:bg-teal-600 file:text-white
            hover:file:bg-teal-700
            transition
          "
        />
      </div>
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
            Please enter valid Price!
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
            Please enter valid Country Name!
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
          Please enter valid Location!
        </p>
      )}
    </div>

    {/* Button */}
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
      {loading ? "Updating..." : "Save Changes"}
    </button>

  </form>
</motion.div>
    </Layout>
  );
}