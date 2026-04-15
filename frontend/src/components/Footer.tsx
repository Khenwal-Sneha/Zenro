import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <motion.footer
      className="mt-auto border-t border-white/10 bg-[#0B0F1A]/80 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 text-center">

        {/* Social Media */}
        <div className="flex justify-center gap-8 text-2xl mb-6 text-gray-400">
          <a href="#" className="hover:text-indigo-400 hover:scale-110 transition">
            <i className="fa-brands fa-square-facebook"></i>
          </a>
          <a href="#" className="hover:text-pink-400 hover:scale-110 transition">
            <i className="fa-brands fa-square-instagram"></i>
          </a>
          <a href="#" className="hover:text-green-400 hover:scale-110 transition">
            <i className="fa-brands fa-square-whatsapp"></i>
          </a>
        </div>

        {/* Branding */}
        <div className="mb-6">
          <h5 className="font-semibold text-lg bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            © 2026 Zenro, Inc.
          </h5>
          <p className="text-gray-400 text-sm mt-1">
            Discover spaces that feel like home. Travel smarter with Zenro.
          </p>
        </div>

        {/* Links */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/privacy"
            className="px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-lg transition text-sm text-gray-300 hover:text-white"
          >
            Privacy
          </Link>

          <Link
            to="/terms"
            className="px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-lg transition text-sm text-gray-300 hover:text-white"
          >
            Terms & Conditions
          </Link>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm shadow-lg hover:scale-105 transition"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </motion.footer>
  );
}