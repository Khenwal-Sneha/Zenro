import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";

type User = {
  _id: string;
  username: string;
  name: string;
  profile: { url: string };
};

type Listing = {
  _id: string;
  title: string;
  price: number;
  image: { url: string };
};

export default function MyProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        setCurrentUser(res.data.user);
        setListings(res.data.listings || []);
      } catch (err: any) {
        navigate("/error", {
          state: {
            error: {
              status: err.response?.status,
              message:
                err.response?.data?.message || "Failed to load profile",
            },
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !currentUser) return;

    try {
      const data = new FormData();
      data.append("image", file);

      await api.post(`/profile/${currentUser.username}/pfp`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg("Profile updated successfully!");
    } catch {
      setErrorMsg("Upload failed");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh] text-gray-400">
          Loading your profile...
        </div>
      </Layout>
    );
  }

  if (!currentUser) return null;

  return (
    <Layout>
      <motion.div
        className="max-w-6xl mx-auto space-y-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >

        {/* ALERTS */}
        <div className="space-y-3">
          <SuccessAlert message={successMsg} />
          <ErrorAlert message={errorMsg} />
        </div>

        {/* PROFILE HEADER */}
        <div className="
          bg-white/70 backdrop-blur-lg
          border border-gray-200
          rounded-2xl p-6
          shadow-sm
          flex flex-col md:flex-row gap-6 items-center
        ">

          {/* AVATAR */}
          <div className="relative">
            <img
              src={
                preview ||
                currentUser.profile?.url ||
                "https://via.placeholder.com/100"
              }
              className="w-24 h-24 rounded-full object-cover border"
            />

            {/* small edit badge */}
            <label className="
              absolute bottom-0 right-0
              bg-teal-600 text-white text-xs
              px-2 py-1 rounded-full cursor-pointer
            ">
              Edit
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    const f = e.target.files[0];
                    setFile(f);
                    setPreview(URL.createObjectURL(f));
                  }
                }}
              />
            </label>
          </div>

          {/* USER INFO */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-semibold text-gray-900">
              {currentUser.name}
            </h2>
            <p className="text-gray-600">@{currentUser.username}</p>

            {/* STATS */}
            <div className="flex gap-6 justify-center md:justify-start mt-4 text-sm">
              <div>
                <p className="font-semibold text-gray-900">
                  {listings.length}
                </p>
                <p className="text-gray-500">Listings</p>
              </div>
            </div>

            {/* UPDATE BUTTON */}
            {file && (
              <button
                onClick={handleUpload}
                className="
                  mt-4
                  bg-gradient-to-r from-teal-600 to-teal-500
                  text-white px-4 py-2 rounded-xl text-sm
                  hover:scale-[1.03] transition
                "
              >
                Save Avatar
              </button>
            )}
          </div>
        </div>

        {/* LISTINGS */}
        {listings.length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Your Spaces ({listings.length})
            </h3>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {listings.map((l) => (
                <motion.div
                  key={l._id}
                  whileHover={{ y: -6 }}
                  className="
                    group
                    bg-white/80 backdrop-blur
                    border border-gray-200
                    rounded-2xl overflow-hidden
                    shadow-sm hover:shadow-xl
                    transition
                  "
                >
                  <Link to={`/listings/${l._id}`}>
                    <img
                      src={l.image?.url}
                      className="
                        h-48 w-full object-cover
                        group-hover:scale-110 transition duration-300
                      "
                    />
                  </Link>

                  <div className="p-4">
                    <h5 className="font-semibold truncate">
                      {l.title}
                    </h5>

                    <p className="text-teal-700 font-semibold mt-2">
                      ₹ {l.price.toLocaleString("en-IN")}
                    </p>

                    <Link
                      to={`/listings/${l._id}`}
                      className="
                        block mt-3 text-center
                        bg-gradient-to-r from-teal-600 to-teal-500
                        text-white py-2 rounded-xl text-sm
                      "
                    >
                      View
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="
            text-center py-16
            bg-white/70 backdrop-blur-lg
            border border-gray-200
            rounded-2xl
          ">
            <h2 className="text-xl font-semibold">
              No spaces yet
            </h2>
            <p className="text-gray-500 mt-2 mb-6">
              Start hosting your first Zenro stay
            </p>

            <Link
              to="/listings/new"
              className="
                bg-gradient-to-r from-teal-600 to-teal-500
                text-white px-6 py-3 rounded-xl
                hover:scale-[1.03] transition
              "
            >
              Create Listing
            </Link>
          </div>
        )}

      </motion.div>
    </Layout>
  );
}