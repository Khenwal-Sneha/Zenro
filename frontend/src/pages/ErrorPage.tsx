import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const errorFromState = location.state?.error;

  const status =
    err?.status ||
    errorFromState?.status ||
    404;

  const message =
    err?.message ||
    errorFromState?.message ||
    "This space doesn’t exist on Zenro… yet.";

  // 🎯 Smart UI based on error
  const config = {
    404: {
      icon: "🏠",
      title: "Lost in Zenro?",
      desc: message,
    },
    401: {
      icon: "🔒",
      title: "Unauthorized access",
      desc: "Please login to continue your journey on Zenro.",
    },
    500: {
      icon: "⚠️",
      title: "Something went wrong",
      desc: "Our servers are having a moment. Try again shortly.",
    },
  };

  const current = config[status as keyof typeof config] || {
    icon: "🚫",
    title: "Unexpected error",
    desc: message,
  };

  return (
    <Layout>
      <motion.div
        className="flex flex-col items-center justify-center text-center py-24 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* ICON */}
        <motion.div
          className="text-6xl mb-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          {current.icon}
        </motion.div>

        {/* STATUS */}
        <h2 className="text-5xl font-semibold text-gray-900 mb-2">
          {status}
        </h2>

        {/* TITLE */}
        <h3 className="text-xl font-medium text-gray-800 mb-3">
          {current.title}
        </h3>

        {/* MESSAGE */}
        <p className="text-gray-600 max-w-md text-sm leading-relaxed">
          {current.desc}
        </p>

        {/* ACTIONS */}
        <div className="flex gap-4 mt-10 flex-wrap justify-center">

          {/* Back Home */}
          <Link
            to="/"
            className="
              bg-teal-600 hover:bg-teal-700
              text-white font-medium
              px-6 py-3 rounded-xl
              shadow-sm hover:shadow-md
              transition-all duration-200
            "
          >
            Back to Zenro
          </Link>

          {/* Go Back */}
          <button
            onClick={() => navigate(-1)}
            className="
              border border-gray-300
              text-gray-700
              px-6 py-3 rounded-xl
              hover:bg-gray-100
              transition
            "
          >
            Go Back
          </button>

          {/* Retry */}
          <button
            onClick={() => window.location.reload()}
            className="
              text-sm text-gray-500 hover:text-gray-700
              underline
            "
          >
            Retry
          </button>

        </div>
      </motion.div>
    </Layout>
  );
}