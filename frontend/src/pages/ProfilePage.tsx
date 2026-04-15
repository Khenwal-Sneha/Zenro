import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
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

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profile/${username}`);
        setUser(res.data.user);
        setListings(res.data.listings || []);

        const me = await api.get("/profile");
        setCurrentUser(me.data.user);
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
  }, [username]);

  const isOwner =
    currentUser && user && currentUser._id === user._id;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    const data = new FormData();
    data.append("img", file);

    try {
      await api.post(`/${user.username}/pfp`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile updated!");
    } catch (err) {
      alert("Upload failed");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center mt-20 text-gray-400">
          Loading Zenro profile...
        </div>
      </Layout>
    );
  }

  if (!user) return null;

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
            src={
              isOwner
                ? currentUser?.profile?.url
                : user.profile?.url
            }
            className="w-28 h-28 rounded-full object-cover border border-white/20"
          />

          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-white">
              {isOwner ? currentUser?.name : user.name}
            </h2>

            <p className="text-gray-400">
              @{isOwner ? currentUser?.username : user.username}
            </p>

            {/* Upload */}
            {isOwner && (
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
            )}
          </div>
        </div>

        {/* LISTINGS */}
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-6">
            {listings.length > 0
              ? `${listings.length} Zenro spaces ${
                  isOwner ? "you’ve hosted" : `by ${user.name}`
                }`
              : isOwner
              ? "You haven’t hosted any Zenro spaces yet"
              : `${user.name} hasn’t hosted any spaces yet`}
          </h3>

          {listings.length > 0 ? (
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
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🏠</div>

              <h2 className="text-xl font-semibold text-white">
                No Zenro spaces yet
              </h2>


              {isOwner && (
                
                <Link
                  to="/listings/new"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition"
                >
                  <p className="text-gray-400 mb-6 mt-2">
                Start hosting and earn from your space
              </p>
                  Start Hosting on Zenro
                </Link>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
}