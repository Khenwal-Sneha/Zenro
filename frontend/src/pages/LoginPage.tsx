import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/login", formData);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div
        className="min-h-[75vh] flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="
          w-full max-w-4xl
          grid md:grid-cols-2
          bg-white/70 backdrop-blur-xl
          border border-gray-200
          rounded-2xl overflow-hidden
          shadow-lg
        ">

          {/* LEFT SIDE (Visual) */}
          <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-teal-600 to-teal-500 text-white">
            <h2 className="text-3xl font-semibold mb-4">
              Welcome Back ✨
            </h2>
            <p className="text-sm text-teal-100 leading-relaxed">
              Log in to explore premium stays, manage your listings,
              and experience travel the Zenro way.
            </p>
          </div>

          {/* RIGHT SIDE (Form) */}
          <div className="p-8 sm:p-10">

            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
              Login
            </h2>

            <p className="text-center text-gray-500 text-sm mb-6">
              Access your account
            </p>

            {/* ERROR */}
            {error && (
              <div className="
                mb-5 px-4 py-2 rounded-xl
                bg-red-50 border border-red-200
                text-red-600 text-sm text-center
              ">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* USERNAME */}
              <div className="relative">
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <label className="
                  absolute left-4 top-2 text-xs text-gray-500
                  peer-placeholder-shown:top-3.5
                  peer-placeholder-shown:text-sm
                  transition-all
                ">
                  Username
                </label>
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />

                <label className="
                  absolute left-4 top-2 text-xs text-gray-500
                  peer-placeholder-shown:top-3.5
                  peer-placeholder-shown:text-sm
                  transition-all
                ">
                  Password
                </label>

                {/* 👁 Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-sm text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  bg-gradient-to-r from-teal-600 to-teal-500
                  text-white font-medium
                  py-3 rounded-xl
                  shadow-md hover:shadow-lg
                  hover:scale-[1.02]
                  transition-all duration-200
                  disabled:opacity-50
                "
              >
                {loading ? "Signing in..." : "Login"}
              </button>

              {/* LINKS */}
              <div className="text-center mt-4 space-y-2">

                <Link
                  to="/signup"
                  className="text-sm text-gray-600 hover:text-teal-600 transition"
                >
                  Don’t have an account? Sign up
                </Link>

                <div>
                  <a
                    href="#"
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Forgot Password?
                  </a>
                </div>

              </div>

            </form>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}