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
          className="mb-4 flex items-center justify-between px-5 py-3 rounded-2xl 
          bg-red-500/10 border border-red-500/20 backdrop-blur-xl 
          shadow-[0_0_25px_rgba(239,68,68,0.15)]"
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -25 }}
          transition={{ duration: 0.3 }}
        >
          <h5 className="font-medium text-red-300">
            {message}
          </h5>

          <button
            onClick={() => setVisible(false)}
            className="ml-4 text-red-400 hover:text-red-200 hover:scale-110 transition text-lg"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}