import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Layout from "../components/Layout";

type ErrorType = {
  status?: number;
  message?: string;
};

type Props = {
  err?: ErrorType;
};

export default function ErrorPage({ err }: Props) {
  const location = useLocation();

  const errorFromState = location.state?.error;

  const status =
    err?.status ||
    errorFromState?.status ||
    404;

  const message =
    err?.message ||
    errorFromState?.message ||
    "This space doesn’t exist on Zenro… yet.";

  return (
    <Layout>
      <motion.div
        className="flex flex-col items-center justify-center text-center py-24"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Icon */}
        <div className="text-6xl mb-6">🚫</div>

        {/* Status */}
        <h2 className="text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {status}
        </h2>

        {/* Message */}
        <h3 className="text-lg text-gray-400 max-w-md">
          {message}
        </h3>

        {/* Button */}
        <Link
          to="/"
          className="mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition"
        >
          Back to Zenro
        </Link>
      </motion.div>
    </Layout>
  );
}