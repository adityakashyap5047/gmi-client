import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const {user, logout} = useUser();

  const navLinks = [
    { name: "Home", href: "/" },
    ...(user
      ? [
          {
            name: "Logout",
            onClick: () => {
              logout();           
            },
          },
        ]
      : [
          { name: "Login", href: "/login" },
          { name: "Register", href: "/register" },
        ]),
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-md border-b border-white/30 shadow-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Site Title */}
        <motion.a
          href="/"
          className="text-2xl font-bold text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          MyTracker
        </motion.a>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8 text-white font-semibold">
          {navLinks.map(({ name, href, onClick }) => (
            <motion.li
              onClick={onClick}
              key={name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer hover:text-indigo-400 transition"
            >
              <a href={href}>{name}</a>
            </motion.li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.ul
          className="md:hidden bg-white/20 backdrop-blur-md border-t border-white/30 text-white font-semibold flex flex-col space-y-4 px-6 py-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          {navLinks.map(({ name, href }) => (
            <motion.li
              key={name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer hover:text-indigo-400 transition"
              onClick={() => setIsOpen(false)}
            >
              <a href={href}>{name}</a>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.nav>
  );
}
