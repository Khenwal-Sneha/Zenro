import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";

export default function ShowListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");

  const fetchListing = async () => {
    try {
      const res = await api.get(`/listings/${id}`);
      setListing(res.data.data || res.data);
    } catch (err) {
      console.log(err);
    }
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
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post(`/listings/${id}/reviews`, {
        rating,
        comment,
      });

      setRating(3);
      setComment("");
      await fetchListing();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await api.delete(`/listings/${id}/reviews/${reviewId}`);
      await fetchListing();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/listings/${id}`);
      alert("Listing deleted");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center mt-24 text-gray-400">
          Loading Zenro space...
        </div>
      </Layout>
    );
  }

  if (!listing) {
    return (
      <Layout>
        <div className="text-center mt-24 text-gray-400">
          Listing not found
        </div>
      </Layout>
    );
  }

  const isOwner =
    currentUser && currentUser._id === listing?.owner?._id;

    return (
      <Layout>
        <motion.div
          className="max-w-6xl mx-auto space-y-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
    
          {/* HERO */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
            <img
              src={listing?.image?.url || "https://via.placeholder.com/800"}
              className="w-full h-[460px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
    
          {/* TITLE BLOCK (MOVED OUTSIDE GRID → MORE PREMIUM FEEL) */}
          <div>
            <h2 className="text-4xl font-semibold text-white tracking-tight">
              {listing?.title}
            </h2>
    
            <p className="text-gray-400 mt-2">
              {listing?.location}, {listing?.country}
            </p>
          </div>
    
          {/* GRID */}
          <div className="grid md:grid-cols-3 gap-10">
    
            {/* LEFT (CONTENT STORY ZONE) */}
            <div className="md:col-span-2 space-y-10">
    
              {/* DESCRIPTION */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-white font-medium mb-2">About this place</h3>
                <p className="text-gray-300 leading-relaxed">
                  {listing?.description}
                </p>
              </div>
    
              {/* REVIEWS (MOVED DOWN = MORE NATURAL FLOW) */}
              <div>
                <button
                  onClick={() => setShowReviews(!showReviews)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition"
                >
                  {showReviews ? "Hide Reviews" : "Guest Reviews"}
                </button>
    
                {showReviews && (
                  <div className="mt-6 space-y-4">
                    {!listing?.reviews?.length ? (
                      <p className="text-gray-400">
                        No reviews yet. Be the first Zenro guest ✨
                      </p>
                    ) : (
                      listing.reviews.map((review: any) => (
                        <div
                          key={review._id}
                          className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                        >
                          <Link to={`/profile/${review?.owner?.username}`}>
                            <div className="flex items-center gap-3 mb-3">
                              <img
                                src={review?.owner?.profile?.url}
                                className="w-10 h-10 rounded-full"
                              />
    
                              <div>
                                <p className="text-white font-medium">
                                  {review?.owner?.name}
                                </p>
                                <p className="text-gray-500 text-sm">
                                  @{review?.owner?.username}
                                </p>
                              </div>
                            </div>
                          </Link>
    
                          <p className="text-gray-300">
                            ⭐ {review.rating}
                          </p>
    
                          <p className="text-gray-400 mt-1">
                            {review.comment}
                          </p>
                          {/* ✅ DELETE BUTTON (FIXED LOCATION) */}
    {currentUser &&
      review?.owner?._id === currentUser._id && (
        <button
          onClick={() => handleDeleteReview(review._id)}
          className="mt-3 text-sm text-red-400 hover:text-red-300 transition"
        >
          Delete Review
        </button>
      )}
                        </div>
                      ))
                    )}
                    
                  </div>
                )}
              </div>
            </div>
    
            {/* RIGHT (BOOKING ACTION PANEL - PREMIUM AIRBNB STYLE) */}
            <div className="space-y-6 sticky top-24">
    
              {/* HOST CARD */}
              <Link to={`/profile/${listing?.owner?.username}`}>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                  <div className="flex items-center gap-3">
                    <img
                      src={listing?.owner?.profile?.url}
                      className="w-12 h-12 rounded-full"
                    />
    
                    <div>
                      <p className="text-white font-semibold">
                        {listing?.owner?.name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        @{listing?.owner?.username}
                      </p>
                    </div>
                  </div>
    
                  <p className="text-gray-500 text-sm mt-3">
                    Zenro Verified Host
                  </p>
                </div>
              </Link>
    
              {/* PRICE + BOOKING (PRIMARY ACTION FIRST) */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-gray-400 text-sm">Price per night</p>
    
                <h3 className="text-3xl font-semibold text-white mt-1">
                  ₹ {listing?.price?.toLocaleString("en-IN")}
                </h3>
    
                <button className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition">
                  Book Now
                </button>
              </div>
    
              {/* OWNER ACTIONS (MOVED BELOW → LESS DISTRACTION) */}
              {isOwner && (
                <div className="flex gap-3">
                  <Link to={`/listings/${listing._id}/edit`} className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition">
                    Edit
                  </Link>
    
                  <button onClick={handleDelete} className="flex-1 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition">
                    Delete
                  </button>
                </div>
              )}
    
              {/* REVIEW FORM (BOTTOM ACTION) */}
              <form
                onSubmit={handleReviewSubmit}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4"
              >
                <p className="text-white font-medium">Leave a review</p>
    
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full"
                />
    
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  placeholder="Share your experience..."
                />
    
                <button className="w-full py-2 rounded-xl bg-indigo-500 text-white font-medium">
                  Submit Review
                </button>
              </form>
    
            </div>
          </div>
        </motion.div>
      </Layout>
    );
}