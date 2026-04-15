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
        <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_25px_rgba(99,102,241,0.15)]">

          <img
            src={currentUser.profile?.url || "https://via.placeholder.com/100"}
            className="w-28 h-28 rounded-full object-cover border border-white/20"
          />

          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-white">
              {currentUser.name}
            </h2>

            <p className="text-gray-400">
              @{currentUser.username}
            </p>

            {/* Upload */}
            <form onSubmit={handleUpload} className="mt-4 flex items-center gap-3">
              <input
                type="file"
                onChange={(e) =>
                  e.target.files && setFile(e.target.files[0])
                }
                className="text-gray-400 text-sm"
              />

              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm shadow-lg hover:scale-105 transition">
                Update Avatar
              </button>
            </form>
          </div>
        </div>

        {/* LISTINGS */}
        <div>
          {listings.length > 0 ? (
            <>
              <h3 className="text-lg font-semibold text-gray-300 mb-5">
                Your Zenro Spaces ({listings.length})
              </h3>

              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {listings.map((listing) => (
                  <motion.div
                    key={listing._id}
                    whileHover={{ scale: 1.04 }}
                    className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-md hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] transition"
                  >
                    <Link to={`/listings/${listing._id}`}>
                      <img
                        src={listing.image?.url || "https://via.placeholder.com/300"}
                        className="h-48 w-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    </Link>

                    <div className="p-4">
                      <h5 className="font-semibold text-white truncate">
                        {listing.title}
                      </h5>

                      <h6 className="text-sm mt-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                        ₹ {listing.price?.toLocaleString("en-IN")}
                      </h6>

                      <Link
                        to={`/listings/${listing._id}`}
                        className="inline-block mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition"
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
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-white">
                No spaces yet
              </h2>

              <p className="text-gray-400 mt-2 mb-6">
                Start hosting your first Zenro space
              </p>

              <Link
                to="/listings/new"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition"
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