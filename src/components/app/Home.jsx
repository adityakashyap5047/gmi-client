import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaUsers, FaShieldAlt } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import LiveTracking from "../LiveTracking";

const features = [
  {
    icon: <FaMapMarkerAlt className="text-purple-400 w-10 h-10" />,
    title: "Real-Time Tracking",
    description:
      "See user locations updated live on the map with smooth animations and instant refresh.",
  },
  {
    icon: <FaUsers className="text-pink-400 w-10 h-10" />,
    title: "User Privacy Control",
    description:
      "Users control their visibility with easy toggle, ensuring privacy and transparency.",
  },
  {
    icon: <FaShieldAlt className="text-indigo-400 w-10 h-10" />,
    title: "Secure & Scalable",
    description:
      "Built on modern technologies with encrypted data and socket-powered real-time updates.",
  },
];

const Home = () => {
  const {user} = useUser();

  return (
    <div className="relative w-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden text-white px-6 py-16 md:py-24 flex flex-col items-center">
      {/* Glowing background */}
      <div className="absolute w-[30rem] h-[30rem] bg-purple-600 rounded-full opacity-30 blur-3xl top-10 left-[-10rem] animate-pulse" />
      <div className="absolute w-[40rem] h-[40rem] bg-pink-600 rounded-full opacity-20 blur-3xl bottom-[-10rem] right-[-10rem] animate-pulse" />


      {/* Top Header */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-4xl mb-12 text-center"
      >
        <h2 className="text-xl my-12 text-purple-400 font-semibold uppercase tracking-widest">
          Welcome to Trackr
        </h2>
        <h1 className="text-5xl mb-8 font-extrabold leading-tight max-w-3xl mx-auto">
          Real-Time Location Tracking for Everyone
        </h1>
        <p className="mt-12 text-gray-300 text-lg max-w-xl mx-auto">
          Seamlessly monitor user movement on an interactive map, powered by
          modern real-time technologies and user-friendly controls.
        </p>
        <p>Hello, {user?.email}</p>
      </motion.header>

      <LiveTracking/>

      <motion.section
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative z-10  bg-white/10 backdrop-blur-md p-12 rounded-xl max-w-3xl text-center shadow-lg border border-white/20 mb-20"
      >
        <p className="text-gray-300 text-lg mb-6">
          Get started now to see the power of live tracking in action.
        </p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/map">
          <button className="bg-white text-black px-8 py-3 rounded-md font-semibold shadow-md hover:bg-gray-200 transition duration-300">
            View Live Map
          </button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-6xl w-full"
      >
        {features.map(({ icon, title, description }) => (
          <div
            key={title}
            className="bg-white/10 backdrop-blur-md rounded-xl p-8 flex flex-col items-center text-center shadow-md border border-white/20 hover:scale-[1.03] transition-transform duration-300 cursor-default"
          >
            <div className="mb-6">{icon}</div>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-gray-300">{description}</p>
          </div>
        ))}
      </motion.section>
    </div>
  );
};

export default Home;