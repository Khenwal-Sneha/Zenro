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
        <div className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_30px_rgba(99,102,241,0.15)]">

          {/* Heading */}
          <h2 className="text-2xl font-semibold text-center text-white">
            Upload your Zenro avatar
          </h2>

          <p className="text-center text-gray-400 text-sm mt-2 mb-6">
            Personalize your profile with a new image
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* DROP AREA STYLE INPUT */}
            <div className="border border-dashed border-white/20 rounded-2xl p-6 text-center bg-white/5 hover:bg-white/10 transition">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && setFile(e.target.files[0])
                }
                className="w-full text-gray-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-500 file:text-white hover:file:bg-indigo-600"
              />

              <p className="text-xs text-gray-500 mt-3">
                JPG, PNG or WEBP supported
              </p>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Update Avatar"}
            </button>
          </form>
        </div>
      </motion.div>
    </Layout>
  );
}