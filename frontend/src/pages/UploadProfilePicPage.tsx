import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import api from "../api/axios";
import { useParams } from "react-router-dom";

export default function UploadProfilePicPage() {
  const { username } = useParams();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please select an image!");
      return;
    }

    if (!username) {
      alert("Invalid user route");
      return;
    }

    const data = new FormData();
    data.append('image', file);

    console.log("Submitting file:", file);
    console.log("");
    try {
      setLoading(true);

    const res = await api.post(`/profile/${username}/pfp`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data?.message || "Profile updated!");
    } catch (err: any) {
      console.log(err.data);
      alert(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div
        className="flex items-center justify-center min-h-[80vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-full max-w-xl bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
  
          {/* Heading */}
          <h2 className="text-2xl font-semibold text-center text-gray-900">
            Upload your Zenro avatar
          </h2>
  
          <p className="text-center text-gray-500 text-sm mt-2 mb-6">
            Personalize your profile with a new image
          </p>
  
          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
  
            {/* FILE INPUT AREA */}
            <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && setFile(e.target.files[0])
                }
                className="w-full text-gray-600 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:bg-white file:text-gray-700 hover:file:bg-gray-100"
              />
  
              <p className="text-xs text-gray-500 mt-3">
                JPG, PNG or WEBP supported
              </p>
            </div>
  
            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Update Avatar"}
            </button>
          </form>
        </div>
      </motion.div>
    </Layout>
  );
}