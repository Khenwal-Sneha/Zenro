import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import logo from "../assets/logo.png";

type User = {
  username: string;
  profile?: { url?: string };
};

type NavbarProps = {
  currentUser?: User | null;
};

export default function Navbar({ currentUser }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      navigate("/login");
      window.location.reload();
    } catch (err) {
      console.log("Logout failed", err);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* TOP NAVBAR */}
      <nav
  className={`sticky top-0 w-full z-50 transition-all duration-300 ${
    scrolled
      ? "bg-white/70 backdrop-blur-xl border-b border-gray-200 shadow-sm"
      : "bg-transparent"
  }`}
>
  <div
    className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
      scrolled ? "py-3" : "py-5"
    }`}
  >
    {/* LOGO */}
    <Link to="/" className="flex items-center gap-2 group">
      <span className="text-lg font-semibold text-gray-800 group-hover:text-teal-700 transition">
        Zenro
      </span>
    </Link>

    {/* CENTER NAV */}
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
      {[
        { name: "Explore", path: "/" },
        { name: "Host", path: "/listings/new" },
      ].map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="relative group"
        >
          <span
            className={`transition ${
              isActive(item.path)
                ? "text-teal-700"
                : "group-hover:text-gray-900"
            }`}
          >
            {item.name}
          </span>

          {/* animated underline */}
          <span
            className={`absolute left-0 -bottom-1 h-[2px] bg-teal-600 rounded-full transition-all duration-300 ${
              isActive(item.path)
                ? "w-full"
                : "w-0 group-hover:w-full"
            }`}
          />
        </Link>
      ))}
    </div>

    {/* RIGHT SIDE */}
    <div className="hidden md:flex items-center gap-4">
      {!currentUser ? (
        <>
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="
              bg-gradient-to-r from-teal-600 to-teal-500
              text-white text-sm font-medium
              px-5 py-2 rounded-xl
              shadow-md hover:shadow-lg
              hover:scale-[1.03]
              transition-all duration-200
            "
          >
            Get Started
          </Link>
        </>
      ) : (
        <div className="relative" ref={dropdownRef}>
          <img
            src={
              currentUser.profile?.url ||
              "https://via.placeholder.com/40"
            }
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="
              w-10 h-10 rounded-full cursor-pointer
              border-2 border-white shadow-md
              hover:scale-105 transition
            "
          />

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="
                  absolute right-0 mt-3 w-56
                  bg-white/80 backdrop-blur-lg
                  border border-gray-200
                  shadow-xl rounded-2xl p-2
                "
              >
                <p className="px-3 py-2 text-xs text-gray-400">
                  Signed in as
                </p>

                <p className="px-3 pb-2 text-sm font-medium text-gray-800 truncate">
                  {currentUser.username}
                </p>

                <div className="border-t my-2"></div>

                <Link
                  to="/profile"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>

    {/* MOBILE BUTTON */}
    <button
      onClick={() => setMenuOpen(true)}
      className="md:hidden text-2xl text-gray-700 hover:scale-110 transition"
    >
      ☰
    </button>
  </div>
</nav>
</>
  );
}