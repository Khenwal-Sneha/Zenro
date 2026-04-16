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
    <div className="min-h-screen flex flex-col bg-slate-50 text-gray-900">

      {/* Navbar */}
      <Navbar currentUser={currentUser} />

      {/* Main Content */}
      <motion.main
        className="
          flex-grow
          max-w-7xl mx-auto w-full
          px-4 sm:px-6 lg:px-8
          py-8
        "
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
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