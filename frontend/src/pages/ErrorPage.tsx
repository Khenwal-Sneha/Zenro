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
  className="flex flex-col items-center justify-center text-center py-24 px-4"
  initial={{ opacity: 0, scale: 0.96 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>

  {/* Icon */}
  <div className="text-5xl mb-6">🚫</div>

  {/* Status */}
  <h2 className="text-4xl font-semibold text-gray-900 mb-2">
    {status}
  </h2>

  {/* Message */}
  <p className="text-gray-600 max-w-md text-sm">
    {message}
  </p>

  {/* Action */}
  <Link
    to="/"
    className="
      mt-8
      bg-teal-600 hover:bg-teal-700
      text-white font-medium
      px-6 py-3 rounded-xl
      shadow-sm hover:shadow-md
      transition-all duration-200
    "
  >
    Back to Zenro
  </Link>

</motion.div>
    </Layout>
  );
}