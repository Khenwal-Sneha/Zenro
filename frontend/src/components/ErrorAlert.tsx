import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ErrorAlertProps = {
  message?: string;
};

export default function ErrorAlert({ message }: ErrorAlertProps) {
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0); // 👈 forces re-animation

  useEffect(() => {
    if (message) {
      setVisible(true);
      setKey((prev) => prev + 1); // trigger fresh render

      const timer = setTimeout(() => {
        setVisible(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={key}
          className="
            relative
            mb-4 flex items-center justify-between
            px-4 py-3 rounded-xl
            bg-red-50 border border-red-200
            text-red-700
            shadow-sm
            overflow-hidden
          "
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {/* Message */}
          <h5 className="text-sm font-medium">
            {message}
          </h5>

          {/* Close */}
          <button
            onClick={() => setVisible(false)}
            className="
              ml-4 text-red-500
              hover:text-red-700
              transition
              text-base
            "
          >
            ✕
          </button>

          {/* ⏳ Progress Bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-red-400"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 4, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}