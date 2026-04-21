import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";

export default function ShowListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [showReviews, setShowReviews] = useState(false);

  const fetchListing = async () => {
    const res = await api.get(`/listings/${id}`);
    setListing(res.data.data || res.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingRes, userRes] = await Promise.all([
          api.get(`/listings/${id}`),
          api.get("/api/current-user"),
        ]);

        setListing(listingRes.data.data || listingRes.data);
        setCurrentUser(userRes.data.user);
      } catch {
        setErrorMsg("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const avgRating =
    listing?.reviews?.length > 0
      ? (
          listing.reviews.reduce((a: number, r: any) => a + r.rating, 0) /
          listing.reviews.length
        ).toFixed(1)
      : null;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/listings/${id}/reviews`, { rating, comment });
      setSuccessMsg("Review added!");
      setRating(3);
      setComment("");
      await fetchListing();
    } catch {
      setErrorMsg("Failed to add review");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/listings/${id}`);
      navigate("/");
    } catch {
      setErrorMsg("Delete failed");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh] text-gray-400">
          Loading space...
        </div>
      </Layout>
    );
  }

  if (!listing) return null;

  const isOwner =
    currentUser && currentUser._id === listing?.owner?._id;

  return (
    <Layout>
      <motion.div
        className="max-w-2xl mx-auto py-10 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >

        {/* ALERTS */}
        <SuccessAlert message={successMsg} />
        <ErrorAlert message={errorMsg} />

        {/* 🧑 OWNER HEADER */}
        <div className="flex items-center gap-3 px-2">
          <img
            src={listing.owner.profile?.url}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <p className="font-semibold text-gray-900">
              {listing.owner.name}
            </p>
            <p className="text-xs text-gray-500">
              @{listing.owner.username}
            </p>
          </div>
        </div>

        {/* 🖼️ IMAGE */}
        <div className="w-full overflow-hidden rounded-2xl">
          <img
            src={listing.image?.url}
            className="w-full h-[420px] object-cover"
          />
        </div>

        {/* 📍 TITLE + PRICE */}
        <div className="px-2 space-y-1">
          <h2 className="text-lg font-semibold text-gray-900">
            {listing.title}
          </h2>

          <p className="text-sm text-gray-500">
            {listing.location}, {listing.country}
          </p>

          <p className="text-teal-700 font-semibold">
            ₹ {listing.price.toLocaleString("en-IN")} / night
          </p>
        </div>

        {/* 📝 DESCRIPTION */}
        <div className="px-2 text-sm text-gray-700">
          <span className="font-semibold mr-2">
            {listing.owner.username}
          </span>
          {listing.description}
        </div>

        {/* ⭐ RATING + TOGGLE */}
        <div className="px-2 flex items-center justify-between">
          {avgRating ? (
            <p className="text-sm text-yellow-500">
              ★ {avgRating} ({listing.reviews.length} reviews)
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              No reviews yet
            </p>
          )}

          <button
            onClick={() => setShowReviews(!showReviews)}
            className="text-sm text-teal-600 font-medium hover:underline"
          >
            {showReviews ? "Hide Reviews" : "Show Reviews"}
          </button>
        </div>

        {/* 💬 REVIEWS */}
        {showReviews && (
          <div className="px-2 space-y-3 mt-2">

            {!listing.reviews?.length ? (
              <p className="text-gray-400 text-sm">
                No reviews yet.
              </p>
            ) : (
              listing.reviews.map((r: any) => (
                <div key={r._id} className="flex gap-3 items-start">

                  <img
                    src={r.owner?.profile?.url}
                    className="w-8 h-8 rounded-full"
                  />

                  <div className="text-sm">
                    <span className="font-semibold mr-2">
                      {r.owner?.username}
                    </span>
                    {r.comment}

                    <div className="text-xs text-gray-400">
                      ★ {r.rating}
                    </div>
                  </div>

                </div>
              ))
            )}

          </div>
        )}

        {/* ✍️ REVIEW FORM */}
        <form
          onSubmit={handleReviewSubmit}
          className="flex items-center gap-3 border-t pt-4 px-2"
        >
          <input
            type="range"
            min="1"
            max="5"
            value={rating}
            onChange={(e) =>
              setRating(Number(e.target.value))
            }
          />

          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a review..."
            className="flex-1 outline-none text-sm"
          />

          <button className="text-teal-600 font-semibold text-sm">
            Post
          </button>
        </form>

        {/* 🔐 OWNER ACTIONS */}
        {isOwner && (
          <div className="flex gap-4 px-2 pt-4">
            <Link
              to={`/listings/${listing._id}/edit`}
              className="text-sm text-gray-600 hover:text-black"
            >
              Edit
            </Link>

            <button
              onClick={handleDelete}
              className="text-sm text-red-500"
            >
              Delete
            </button>
          </div>
        )}

      </motion.div>
    </Layout>
  );
}