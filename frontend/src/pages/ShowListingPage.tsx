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

  {/* HERO IMAGE */}
  <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
    <img
      src={listing?.image?.url || "https://via.placeholder.com/800"}
      className="w-full h-[420px] object-cover"
    />
  </div>

  {/* TITLE */}
  <div>
    <h2 className="text-3xl font-semibold text-gray-900">
      {listing?.title}
    </h2>

    <p className="text-gray-600 mt-1">
      {listing?.location}, {listing?.country}
    </p>
  </div>

  {/* GRID */}
  <div className="grid md:grid-cols-3 gap-10">

    {/* LEFT */}
    <div className="md:col-span-2 space-y-8">

      {/* DESCRIPTION */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-2">
          About this place
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {listing?.description}
        </p>
      </div>

      {/* REVIEWS */}
      <div>
        <button
          onClick={() => setShowReviews(!showReviews)}
          className="
            px-5 py-2.5 rounded-xl
            bg-teal-600 hover:bg-teal-700
            text-white text-sm font-medium
            shadow-sm hover:shadow-md
            transition
          "
        >
          {showReviews ? "Hide Reviews" : "Guest Reviews"}
        </button>

        {showReviews && (
          <div className="mt-6 space-y-4">
            {!listing?.reviews?.length ? (
              <p className="text-gray-500">
                No reviews yet. Be the first guest.
              </p>
            ) : (
              listing.reviews.map((review: any) => (
                <div
                  key={review._id}
                  className="
                    bg-white border border-gray-200
                    rounded-xl p-4
                    shadow-sm
                  "
                >
                  <Link to={`/profile/${review?.owner?.username}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={review?.owner?.profile?.url}
                        className="w-9 h-9 rounded-full"
                      />

                      <div>
                        <p className="text-gray-900 font-medium">
                          {review?.owner?.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          @{review?.owner?.username}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <p className="text-sm text-teal-700">
                    ★ {review.rating}
                  </p>

                  <p className="text-gray-600 text-sm mt-1">
                    {review.comment}
                  </p>

                  {currentUser &&
                    review?.owner?._id === currentUser._id && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="mt-2 text-xs text-red-600 hover:underline"
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

    {/* RIGHT PANEL */}
    <div className="space-y-6">

      {/* HOST */}
      <Link to={`/profile/${listing?.owner?.username}`}>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <img
              src={listing?.owner?.profile?.url}
              className="w-10 h-10 rounded-full"
            />

            <div>
              <p className="text-gray-900 font-medium">
                {listing?.owner?.name}
              </p>
              <p className="text-gray-500 text-sm">
                @{listing?.owner?.username}
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* PRICE */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p className="text-gray-500 text-sm">Price per night</p>

        <h3 className="text-2xl font-semibold text-gray-900 mt-1">
          ₹ {listing?.price?.toLocaleString("en-IN")}
        </h3>

        <button
          className="
            w-full mt-4
            bg-teal-600 hover:bg-teal-700
            text-white font-medium
            py-2.5 rounded-xl
            shadow-sm hover:shadow-md
            transition
          "
        >
          Book Now
        </button>
      </div>

      {/* OWNER ACTIONS */}
      {isOwner && (
        <div className="flex gap-3">
          <Link
            to={`/listings/${listing._id}/edit`}
            className="
              flex-1 text-center
              border border-gray-300
              text-gray-700
              py-2 rounded-xl
              hover:bg-gray-100
              transition
            "
          >
            Edit
          </Link>

          <button
            onClick={handleDelete}
            className="
              flex-1
              bg-red-600 hover:bg-red-700
              text-white
              py-2 rounded-xl
              transition
            "
          >
            Delete
          </button>
        </div>
      )}

      {/* REVIEW FORM */}
      <form
        onSubmit={handleReviewSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm"
      >
        <p className="text-gray-900 font-medium">
          Leave a review
        </p>

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
          className="
            w-full border border-gray-300
            rounded-xl px-3 py-2
            focus:outline-none
            focus:ring-2 focus:ring-teal-500
          "
          placeholder="Share your experience..."
        />

        <button
          className="
            w-full
            bg-teal-600 hover:bg-teal-700
            text-white font-medium
            py-2 rounded-xl
            transition
          "
        >
          Submit Review
        </button>
      </form>

    </div>
  </div>
</motion.div>
      </Layout>
    );
}