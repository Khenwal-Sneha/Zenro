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
  <div
    className="
      flex flex-col sm:flex-row items-start sm:items-center gap-6
      bg-white border border-gray-200
      rounded-2xl p-6 shadow-sm
    "
  >
    <img
      src={
        isOwner
          ? currentUser?.profile?.url
          : user.profile?.url
      }
      className="w-24 h-24 rounded-full object-cover border border-gray-200"
    />

    <div className="flex-1">
      <h2 className="text-xl font-semibold text-gray-900">
        {isOwner ? currentUser?.name : user.name}
      </h2>

      <p className="text-gray-600">
        @{isOwner ? currentUser?.username : user.username}
      </p>

      {/* Upload */}
      {isOwner && (
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
              transition
            "
          >
            Update Avatar
          </button>
        </form>
      )}
    </div>
  </div>

  {/* LISTINGS */}
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-6">
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
    ) : (
      <div
        className="
          text-center py-16
          bg-white border border-gray-200
          rounded-2xl shadow-sm
        "
      >
        <div className="text-4xl mb-3">🏠</div>

        <h2 className="text-xl font-semibold text-gray-900">
          No Zenro spaces yet
        </h2>

        {isOwner && (
          <>
            <p className="text-gray-600 mt-2 mb-6">
              Start hosting and earn from your space
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
              Start Hosting on Zenro
            </Link>
          </>
        )}
      </div>
    )}
  </div>
</motion.div>
    </Layout>
  );
}