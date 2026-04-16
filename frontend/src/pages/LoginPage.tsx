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
      const res = await api.post("/login", formData);
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
  className="flex items-center justify-center min-h-[75vh]"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  <div
    className="
      w-full max-w-md
      bg-white border border-gray-200
      rounded-2xl p-8
      shadow-sm
    "
  >

    {/* Heading */}
    <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
      Welcome back to Zenro
    </h2>

    <p className="text-center text-gray-600 text-sm mb-6">
      Login to continue exploring premium stays
    </p>

    {/* Error */}
    {error && (
      <div
        className="
          mb-4 px-4 py-2 rounded-xl
          bg-red-50 border border-red-200
          text-red-700 text-sm text-center
        "
      >
        {error}
      </div>
    )}

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="
            w-full mt-2
            border border-gray-300
            rounded-xl px-4 py-2.5
            focus:outline-none
            focus:ring-2 focus:ring-teal-500
            focus:border-transparent
          "
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="
            w-full mt-2
            border border-gray-300
            rounded-xl px-4 py-2.5
            focus:outline-none
            focus:ring-2 focus:ring-teal-500
            focus:border-transparent
          "
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          bg-teal-600 hover:bg-teal-700
          text-white font-medium
          py-3 rounded-xl
          shadow-sm hover:shadow-md
          transition-all duration-200
          disabled:opacity-50
        "
      >
        {loading ? "Signing in..." : "Login"}
      </button>

      {/* Links */}
      <div className="text-center space-y-2 mt-4">
        <Link
          to="/signup"
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          Create new account
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
</motion.div>
    </Layout>
  );
}