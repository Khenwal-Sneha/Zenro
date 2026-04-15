import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
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
      } catch (err) {
        console.log("User not logged in");
        setCurrentUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0B0F1A] text-white overflow-hidden">

      {/* 🌌 Background Glow Effects */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-indigo-600/20 rounded-full blur-3xl"></div>

      {/* Navbar */}
      <Navbar currentUser={currentUser} />

      {/* Main Content */}
      <motion.main
        className="relative flex-grow max-w-6xl mx-auto w-full px-6 py-10"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Alerts */}
        <div className="space-y-4 mb-6">
          <SuccessAlert />
          <ErrorAlert />
        </div>

        {/* Page Content */}
        {children}
      </motion.main>

      {/* Footer */}
      <Footer />
    </div>
  );
}