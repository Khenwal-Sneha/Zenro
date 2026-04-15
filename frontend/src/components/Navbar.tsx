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
            ? "bg-[#0B0F1A]/80 backdrop-blur-2xl shadow-lg border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ${
            scrolled ? "py-2" : "py-4"
          }`}
        >

          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-30 w-30em cursor-pointer transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_14px_rgba(139,92,246,0.9)]"
            />
          </Link>

          {/* CENTER NAV (Airbnb style) */}
          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-300">
            <Link
              to="/"
              className={`relative transition hover:text-white ${
                isActive("/") ? "text-white" : ""
              }`}
            >
              Explore
              {isActive("/") && (
                <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full" />
              )}
            </Link>

            <Link
              to="/listings/new"
              className={`relative transition hover:text-white ${
                isActive("/listings/new") ? "text-white" : ""
              }`}
            >
              Host
              {isActive("/listings/new") && (
                <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full" />
              )}
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex items-center gap-4">

            {!currentUser ? (
              <>
                <Link
                  to="/signup"
                  className="text-sm text-gray-300 hover:text-white transition"
                >
                  Sign up
                </Link>

                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm shadow-lg hover:scale-105 transition"
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
                  className="w-10 h-10 rounded-full cursor-pointer border border-white/20 hover:scale-105 transition"
                />

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-3 w-48 bg-[#0B0F1A]/90 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-2"
                    >
                      <Link
                        to="/profile"
                        className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
                      >
                        Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* MOBILE MENU */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-4xl text-gray-300"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-72 bg-[#0B0F1A] border-l border-white/10 p-6"
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-white text-lg font-semibold mb-6">
                Menu
              </h2>

              <div className="flex flex-col gap-5 text-gray-300">
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
                      className="text-left text-red-400"
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