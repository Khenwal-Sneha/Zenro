import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ErrorAlertProps = {
  message?: string;
};

export default function ErrorAlert({ message }: ErrorAlertProps) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="
            mb-4 flex items-center justify-between
            px-4 py-3 rounded-xl
            bg-red-50 border border-red-200
            text-red-700
            shadow-sm
          "
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <h5 className="text-sm font-medium">
            {message}
          </h5>

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
        </motion.div>
      )}
    </AnimatePresence>
  );
}