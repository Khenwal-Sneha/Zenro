import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <motion.footer
      className="mt-auto border-t border-gray-200 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">

        {/* Social Media */}
        <div className="flex justify-center gap-6 text-xl mb-6 text-gray-500">
          <a href="#" className="hover:text-teal-600 transition-transform duration-200 hover:scale-110">
            <i className="fa-brands fa-square-facebook"></i>
          </a>
          <a href="#" className="hover:text-teal-600 transition-transform duration-200 hover:scale-110">
            <i className="fa-brands fa-square-instagram"></i>
          </a>
          <a href="#" className="hover:text-teal-600 transition-transform duration-200 hover:scale-110">
            <i className="fa-brands fa-square-whatsapp"></i>
          </a>
        </div>

        {/* Branding */}
        <div className="mb-6">
          <h5 className="font-semibold text-lg text-gray-900">
            © 2026 Zenro, Inc.
          </h5>
          <p className="text-gray-600 text-sm mt-1">
            Discover spaces that feel like home. Travel smarter with Zenro.
          </p>
        </div>

        {/* Links */}
        <div className="flex justify-center gap-3 flex-wrap">

          <Link
            to="/privacy"
            className="
              px-4 py-2
              rounded-xl
              border border-gray-300
              text-sm text-gray-700
              hover:bg-gray-100
              transition
            "
          >
            Privacy
          </Link>

          <Link
            to="/terms"
            className="
              px-4 py-2
              rounded-xl
              border border-gray-300
              text-sm text-gray-700
              hover:bg-gray-100
              transition
            "
          >
            Terms & Conditions
          </Link>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="
              bg-teal-600 hover:bg-teal-700
              text-white text-sm font-medium
              px-4 py-2 rounded-xl
              shadow-sm hover:shadow-md
              transition-all duration-200
            "
          >
            Back to Top ↑
          </button>

        </div>
      </div>
    </motion.footer>
  );
}