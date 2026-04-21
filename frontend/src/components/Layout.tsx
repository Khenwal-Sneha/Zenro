import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SuccessAlert from "./SuccessAlert";
import ErrorAlert from "./ErrorAlert";
import api from "../api/axios";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/profile");
        setCurrentUser(res.data.user);
      } catch {
        setCurrentUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">

      {/* 🌈 BACKGROUND LAYER */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-teal-50" />

      {/* Navbar */}
      <Navbar currentUser={currentUser} />

      {/* FLOATING ALERTS */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div className="space-y-3">
          <SuccessAlert />
          <ErrorAlert />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="
            flex-grow
            w-full
            max-w-7xl mx-auto
            px-4 sm:px-6 lg:px-8
            pt-28 pb-12
          "
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.98 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* CONTENT WRAPPER (glass feel) */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6">
            {children}
          </div>
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </div>
  );
}