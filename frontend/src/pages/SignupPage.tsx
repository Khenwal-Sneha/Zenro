import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkUsername = async () => {
    const res = await api.get(
      `/api/check-username?username=${formData.username}`
    );
    return res.data.exists;
  };

  const checkEmail = async () => {
    const res = await api.get(
      `/api/check-email?email=${encodeURIComponent(formData.email)}`
    );
    return res.data.exists;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const [emailExists, usernameExists] = await Promise.all([
        checkEmail(),
        checkUsername(),
      ]);

      if (emailExists || usernameExists) {
        setErrors({
          email: emailExists ? "Email already exists" : "",
          username: usernameExists ? "Username already exists" : "",
        });
        setLoading(false);
        return;
      }

      const res = await api.post("/signup", formData);

      if (res.data.success) {
        navigate("/login");
      } else {
        setErrors({ api: res.data.message });
      }
    } catch (err: any) {
      setErrors({
        api: err?.response?.data?.message || "Signup failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div
        className="flex items-center justify-center min-h-[80vh]"
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
            Create your Zenro account
          </h2>

          <p className="text-center text-gray-600 text-sm mb-6">
            Join to start hosting premium spaces
          </p>

          {/* API ERROR */}
          {errors.api && (
            <div className="mb-4 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {errors.api}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="
                  w-full mt-2
                  border border-gray-300
                  rounded-xl px-4 py-2.5
                  focus:outline-none
                  focus:ring-2 focus:ring-teal-500
                "
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="
                  w-full mt-2
                  border border-gray-300
                  rounded-xl px-4 py-2.5
                  focus:outline-none
                  focus:ring-2 focus:ring-teal-500
                "
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="
                  w-full mt-2
                  border border-gray-300
                  rounded-xl px-4 py-2.5
                  focus:outline-none
                  focus:ring-2 focus:ring-teal-500
                "
              />
              {errors.username && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.username}
                </p>
              )}
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
                "
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 characters
              </p>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password}
                </p>
              )}
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
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            {/* Footer link */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-teal-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </Layout>
  );
}