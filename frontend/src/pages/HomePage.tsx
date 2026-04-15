import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";

type Listing = {
  _id: string;
  title: string;
  price: number;
  image?: {
    url?: string;
  };
};

export default function HomePage() {
  const [alllistings, setAllListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get("/");
        const data = res.data.data ?? res.data;

        setAllListings(Array.isArray(data) ? data : []);
      } catch (err) {
        setAllListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="text-center mt-20 text-gray-400">
          Loading Zenro spaces...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {alllistings.map((listing) => (
          <motion.div
          key={listing._id}
          whileHover={{ scale: 1.03 }}
          className="group relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_20px_60px_rgba(99,102,241,0.25)] transition-all duration-300"
        >
          {/* IMAGE */}
          <Link to={`/listings/${listing._id}`} className="block relative">
            <div className="overflow-hidden">
              <img
                src={listing.image?.url || "https://via.placeholder.com/300"}
                alt={listing.title}
                className="h-52 w-full object-cover transform group-hover:scale-110 transition duration-500 ease-out"
              />
            </div>
        
            {/* IMAGE OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        
            {/* PRICE BADGE */}
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-semibold">
              ₹ {listing.price?.toLocaleString("en-IN")}
            </div>
          </Link>
        
          {/* CONTENT */}
          <div className="p-4 space-y-2">
            <h5 className="font-semibold text-white text-lg truncate group-hover:text-indigo-300 transition">
              {listing.title}
            </h5>
        
            {/* subtle divider */}
            <div className="h-px w-full bg-white/10 my-2" />
        
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Zenro Stay
              </p>
        
              <div className="flex items-center gap-1 text-yellow-400 text-xs">
                ★ <span className="text-gray-300">4.8</span>
              </div>
            </div>
        
            {/* CTA */}
            <Link
              to={`/listings/${listing._id}`}
              className="mt-3 inline-flex w-full items-center justify-center px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
            >
              View Details
            </Link>
          </div>
        
          {/* glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />
        </motion.div>
        ))}
      </motion.div>
    </Layout>
  );
}