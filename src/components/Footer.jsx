import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* 📌 About */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">About BlinkVault</h3>
          <p className="text-sm leading-6">
            BlinkVault is a modern, distraction-free social platform focused on deep thoughts and smart sharing.
          </p>
        </div>

        {/* 🔗 Quick Links */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/upload" className="hover:underline">Upload</Link></li>
            <li><Link to="/terms" className="hover:underline">Terms & Conditions</Link></li>
            <li><Link to="/profile" className="hover:underline">Profile</Link></li>
          </ul>
        </div>

        {/* 📞 Contact */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Contact Us</h3>
          <p>Email: <a href="mailto:theblinkvault@gmail.com" className="text-blue-500 hover:underline">theblinkvault@gmail.com</a></p>
        </div>
      </div>

      {/* 🔻 Bottom Line */}
      <div className="text-center py-4 border-t border-gray-300 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} The BlinkVault. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
