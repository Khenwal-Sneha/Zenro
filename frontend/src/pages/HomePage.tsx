import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";

type Listing = {
  _id: string;
  title: string;
  price: number;
  country?: string;
  location?: string;
  image?: {
    url?: string;
  };
};

export default function HomePage() {
  const [alllistings, setAllListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // 🎠 Hero carousel
  const heroSlides = [
    {
      img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      title: "Find your perfect stay",
      subtitle: "Luxury, comfort, and vibes — all in one place",
    },
    {
      img: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0",
      title: "Live like you belong",
      subtitle: "Curated homes for unforgettable stays",
    },
    {
      img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      title: "Escape the ordinary",
      subtitle: "Spaces that inspire your journey",
    },
    {
      img: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
      title: "Work & Relax",
      subtitle: "Perfect mix of productivity and peace",
    },
    {
      img: "https://images.unsplash.com/photo-1494526585095-c41746248156",
      title: "Your next stay awaits",
      subtitle: "Book instantly. Experience endlessly.",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // 📦 Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get("/");
        const data = res.data.data ?? res.data;
        setAllListings(Array.isArray(data) ? data : []);
      } catch {
        setAllListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // 🔎 Filtering
  const filteredListings = alllistings.filter((listing) => {
    const searchText = search.toLowerCase();

    return (
      (listing.title?.toLowerCase().includes(searchText) ||
        listing.location?.toLowerCase().includes(searchText) ||
        listing.country?.toLowerCase().includes(searchText)) &&
      (!location ||
        listing.location?.toLowerCase().includes(location.toLowerCase())) &&
      (!country ||
        listing.country?.toLowerCase().includes(country.toLowerCase())) &&
      (!minPrice || listing.price >= Number(minPrice)) &&
      (!maxPrice || listing.price <= Number(maxPrice))
    );
  });

  if (loading) {
    return (
      <Layout>
        <div className="text-center mt-20 text-gray-500">
          Loading Zenro spaces...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
  
      {/* 🌟 HERO */}
      <div className="relative rounded-3xl mb-24 h-[420px]">
  
        {/* Slides */}
        {heroSlides.map((slide, index) => (
          <motion.img
            key={index}
            src={slide.img}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ opacity: currentSlide === index ? 1 : 0 }}
            transition={{ duration: 1 }}
          />
        ))}
  
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10" />
  
        {/* Text */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-4xl md:text-5xl font-semibold text-white">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-gray-200 mt-3">
            {heroSlides[currentSlide].subtitle}
          </p>
        </div>
  
        {/* 🔍 SEARCH BAR */}
        <div className="
          absolute -bottom-10 left-1/2 -translate-x-1/2
          w-[96%] md:w-[85%]
          z-10000
          bg-white/90 backdrop-blur-xl
          border border-white/40
          shadow-[0_20px_60px_rgba(0,0,0,0.2)]
          rounded-full
          px-4 py-3
          flex flex-wrap md:flex-nowrap items-center gap-3
        ">
  
          {/* SEARCH */}
          <div className="flex flex-col px-3 border-r border-gray-200 flex-1 min-w-[140px]">
            <label className="text-xs text-gray-500">Search</label>
            <input
              type="text"
              placeholder="Anywhere"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none text-sm font-medium bg-transparent"
            />
          </div>
  
          {/* LOCATION */}
          <div className="flex flex-col px-3 border-r border-gray-200 min-w-[120px]">
            <label className="text-xs text-gray-500">Location</label>
            <input
              type="text"
              placeholder="City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="outline-none text-sm font-medium bg-transparent"
            />
          </div>
  
          {/* COUNTRY */}
          <div className="flex flex-col px-3 border-r border-gray-200 min-w-[120px]">
            <label className="text-xs text-gray-500">Country</label>
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="outline-none text-sm font-medium bg-transparent"
            />
          </div>
  
          {/* PRICE */}
          <div className="flex items-center gap-2 px-3 border-r border-gray-200">
            <div className="flex flex-col">
              <label className="text-xs text-gray-500">Min</label>
              <input
                type="number"
                placeholder="₹0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-20 outline-none text-sm font-medium bg-transparent"
              />
            </div>
  
            <span className="text-gray-400">—</span>
  
            <div className="flex flex-col">
              <label className="text-xs text-gray-500">Max</label>
              <input
                type="number"
                placeholder="₹5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-20 outline-none text-sm font-medium bg-transparent"
              />
            </div>
          </div>
  
          {/* BUTTON */}
          <button
            className="
              ml-auto
              px-6 py-3
              rounded-full
              bg-teal-600 hover:bg-teal-700
              text-white font-medium
              shadow-lg
              hover:scale-105
              transition
            "
          >
            Search
          </button>
        </div>
      </div>
  
      {/* ✅ IMPORTANT: spacing AFTER hero */}
      <div className="mt-30" />
  
      {/* 🏡 GRID */}
      <motion.div
        className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {filteredListings.map((listing) => (
          <motion.div
            key={listing._id}
            whileHover={{ y: -4 }}
            className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <Link to={`/listings/${listing._id}`}>
              <img
                src={listing.image?.url || "https://via.placeholder.com/300"}
                className="h-48 w-full object-cover group-hover:scale-105 transition"
              />
            </Link>
  
            <div className="p-4 space-y-2">
              <h5 className="font-semibold text-gray-900 truncate">
                {listing.title}
              </h5>
  
              <p className="text-gray-500 text-xs">
                {listing.location}, {listing.country}
              </p>
  
              <p className="text-teal-700 font-medium text-sm">
                ₹ {listing.price?.toLocaleString("en-IN")}
              </p>
  
              <Link
                to={`/listings/${listing._id}`}
                className="block mt-3 text-center bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-xl text-sm"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
  
      {/* EMPTY */}
      {filteredListings.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No stays match your filters
        </div>
      )}
  
    </Layout>
)};