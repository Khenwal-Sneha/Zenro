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
      ? "bg-white border-b border-gray-200 shadow-sm"
      : "bg-transparent"
  }`}
>
  <div
    className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
      scrolled ? "py-3" : "py-5"
    }`}
  >

    {/* LOGO */}
    <Link to="/" className="flex items-center">
      <img
        src={logo}
        alt="Logo"
        className="h-10 w-auto transition-transform duration-200 hover:scale-105"
      />
    </Link>

    {/* CENTER NAV */}
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
      <Link
        to="/"
        className={`relative transition ${
          isActive("/") ? "text-teal-700" : "hover:text-gray-900"
        }`}
      >
        Explore
        {isActive("/") && (
          <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-teal-600 rounded-full" />
        )}
      </Link>

      <Link
        to="/listings/new"
        className={`relative transition ${
          isActive("/listings/new")
            ? "text-teal-700"
            : "hover:text-gray-900"
        }`}
      >
        Host
        {isActive("/listings/new") && (
          <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-teal-600 rounded-full" />
        )}
      </Link>
    </div>

    {/* RIGHT SIDE */}
    <div className="hidden md:flex items-center gap-3">

      {!currentUser ? (
        <>
          <Link
            to="/signup"
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            Sign up
          </Link>

          <Link
            to="/login"
            className="
              bg-teal-600 hover:bg-teal-700
              text-white text-sm font-medium
              px-4 py-2 rounded-xl
              shadow-sm hover:shadow-md
              transition-all duration-200
            "
          >
            Login
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
            className="w-10 h-10 rounded-full cursor-pointer border border-gray-300 hover:scale-105 transition"
          />

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="
                  absolute right-0 mt-3 w-52
                  bg-white border border-gray-200
                  shadow-lg rounded-2xl p-2
                "
              >
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

    {/* MOBILE MENU BUTTON */}
    <button
      onClick={() => setMenuOpen(true)}
      className="md:hidden text-2xl text-gray-700"
    >
      ☰
    </button>
  </div>
</nav>

{/* MOBILE DRAWER */}
<AnimatePresence>
  {menuOpen && (
    <motion.div
      className="fixed inset-0 bg-black/30 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setMenuOpen(false)}
    >
      <motion.div
        className="
          absolute right-0 top-0 h-full w-72
          bg-white border-l border-gray-200
          p-6
        "
        initial={{ x: 300 }}
        animate={{ x: 0 }}
        exit={{ x: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Menu
        </h2>

        <div className="flex flex-col gap-5 text-gray-700 text-sm">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Explore
          </Link>

          <Link to="/listings/new" onClick={() => setMenuOpen(false)}>
            Host
          </Link>

          {!currentUser ? (
            <>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                Sign up
              </Link>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-left text-red-500"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
}