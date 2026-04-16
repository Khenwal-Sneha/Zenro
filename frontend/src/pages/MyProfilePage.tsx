import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";

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
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");

        setCurrentUser(res.data.user);
        setListings(res.data.listings || []);
        console.log("PROFILE RESPONSE:", res.data);
      } catch (err: any) {
        navigate("/error", {
          state: {
            error: {
              status: err.response?.status,
              message: err.response?.data?.message || "Failed to load profile",
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

    const data = new FormData();
    data.append("image", file);

    try {
      await api.post(`/profile/${currentUser.username}/pfp`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile updated!");
      window.location.reload();
    } catch (err) {
      alert("Upload failed");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center mt-20 text-gray-400">
          Loading your Zenro profile...
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

  {/* PROFILE HEADER */}
  <div
    className="
      flex flex-col sm:flex-row items-start sm:items-center gap-6
      bg-white border border-gray-200
      rounded-2xl p-6 shadow-sm
    "
  >
    <img
      src={currentUser.profile?.url || "https://via.placeholder.com/100"}
      className="
        w-24 h-24 rounded-full object-cover
        border border-gray-200
      "
    />

    <div className="flex-1">
      <h2 className="text-xl font-semibold text-gray-900">
        {currentUser.name}
      </h2>

      <p className="text-gray-600">
        @{currentUser.username}
      </p>

      {/* Upload */}
      <form
        onSubmit={handleUpload}
        className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center"
      >
        <input
          type="file"
          onChange={(e) =>
            e.target.files && setFile(e.target.files[0])
          }
          className="
            text-sm text-gray-600
            file:mr-4 file:px-4 file:py-2
            file:rounded-xl file:border-0
            file:bg-teal-600 file:text-white
            hover:file:bg-teal-700
            transition
          "
        />

        <button
          className="
            bg-teal-600 hover:bg-teal-700
            text-white text-sm font-medium
            px-4 py-2 rounded-xl
            shadow-sm hover:shadow-md
            transition-all duration-200
          "
        >
          Update Avatar
        </button>
      </form>
    </div>
  </div>

  {/* LISTINGS */}
  <div>
    {listings.length > 0 ? (
      <>
        <h3 className="text-lg font-semibold text-gray-900 mb-5">
          Your Zenro Spaces ({listings.length})
        </h3>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <motion.div
              key={listing._id}
              whileHover={{ y: -4 }}
              className="
                group
                bg-white border border-gray-200
                rounded-2xl overflow-hidden
                shadow-sm hover:shadow-md
                transition-all duration-200
              "
            >
              <Link to={`/listings/${listing._id}`}>
                <img
                  src={listing.image?.url || "https://via.placeholder.com/300"}
                  className="
                    h-48 w-full object-cover
                    group-hover:scale-105 transition duration-300
                  "
                />
              </Link>

              <div className="p-4 space-y-2">
                <h5 className="font-semibold text-gray-900 truncate">
                  {listing.title}
                </h5>

                <p className="text-teal-700 text-sm font-medium">
                  ₹ {listing.price?.toLocaleString("en-IN")}
                </p>

                <Link
                  to={`/listings/${listing._id}`}
                  className="
                    block text-center mt-3
                    bg-teal-600 hover:bg-teal-700
                    text-white text-sm font-medium
                    py-2 rounded-xl
                    transition
                  "
                >
                  View Listing
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </>
    ) : (
      /* EMPTY STATE */
      <div
        className="
          text-center py-16
          bg-white border border-gray-200
          rounded-2xl shadow-sm
        "
      >
        <h2 className="text-xl font-semibold text-gray-900">
          No spaces yet
        </h2>

        <p className="text-gray-600 mt-2 mb-6">
          Start hosting your first Zenro space
        </p>

        <Link
          to="/listings/new"
          className="
            bg-teal-600 hover:bg-teal-700
            text-white font-medium
            px-6 py-3 rounded-xl
            shadow-sm hover:shadow-md
            transition
          "
        >
          Create Your First Listing
        </Link>
      </div>
    )}
  </div>
</motion.div>
    </Layout>
  );
}