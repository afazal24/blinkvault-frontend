import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SplashAnimation = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 5500); // ⏱️ Updated: 5.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-center"
          >
            <motion.img
              src="/logo.png"
              alt="logo"
              className="w-16 h-16 mx-auto mb-4"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Welcome to the World of Thoughts
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              The BlinkVault | Share. Reflect. Grow.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashAnimation;
