import React from "react";
import { motion } from "framer-motion";

const AuthCard = ({ title, children }) => {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-gray-900 to-black">
      {/* Animated background gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#1e3a8a,_transparent_40%),_radial-gradient(circle_at_bottom_right,_#2563eb,_transparent_40%)] opacity-50"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Glassmorphic card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-[380px] max-w-[90vw] p-10 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl text-white"
      >
        {/* Tower Logo */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="w-14 h-14 text-yellow-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M32 2 L42 12 L22 12 Z" />
            <path d="M32 12 L32 50" />
            <path d="M20 22 H44" />
            <path d="M16 32 H48" />
            <path d="M12 42 H52" />
            <path d="M8 52 H56" />
            <path d="M24 50 L16 62" />
            <path d="M40 50 L48 62" />
          </svg>

          <h1 className="text-xl font-bold text-center">POWERGRID</h1>
          <p className="text-sm text-gray-300 -mt-1">
            AI Supply Chain Planning
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6">{title}</h2>

        {children}
      </motion.div>
    </div>
  );
};

export default AuthCard;
