import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useUser } from "../../context/UserContext";
import { motion } from "framer-motion";

const socket = io(import.meta.env.VITE_PUBLIC_API_URL);

export default function LiveTracking() {
  const { user } = useUser();
  const [userLocations, setUserLocations] = useState([]);
  const [visible, setVisible] = useState(true);
  const watchIdRef = useRef(null);

  const toggleVisibility = () => {
    setVisible((prev) => !prev);
    socket.emit("visibility-toggle", { userId: user._id, visible: !visible });
  };

  // Start/Stop location tracking based on visibility
  useEffect(() => {
    if (!user || !user._id) return;

    if (visible) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          socket.emit("location-update", {
            userId: user._id,
            lat: latitude,
            lng: longitude,
          });
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
    } else {
      navigator.geolocation.clearWatch(watchIdRef.current);
      socket.emit("remove-user", { userId: user._id });
    }

    return () => {
      navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [visible, user]);

  // Receive updated user locations
  useEffect(() => {
    socket.on("location-data", (locations) => {
      setUserLocations(locations);
    });

    return () => {
      socket.off("location-data");
    };
  }, []);

  return (
    <div className="p-6 mb-12 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold mr-4">Live User Coordinates</h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button onClick={toggleVisibility} className={`${visible ? "bg-cyan-500 hover:bg-cyan-800" : "bg-amber-300 hover:bg-amber-800"} cursor-pointer text-black px-8 py-3 rounded-md font-semibold shadow-md transition duration-300`}>
            {visible ? "Hide" : "Show"} Your Appearance
          </button>
        </motion.div>
      </div>
      {userLocations.length > 0 
        ? 
          <div className="flex p-4 gap-4 flex-wrap">
            <motion.section
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="relative z-10 flex gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl max-w-3xl text-center shadow-lg border border-white/20 "
            >
              {userLocations.length > 0 && userLocations.map((u) => (
                <motion.section
                key={u.email}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  className="relative z-10  bg-white/10 backdrop-blur-md p-12 rounded-md max-w-3xl text-center shadow-lg border border-white/20 mb-4"
                >
                  <p><strong>Email: </strong>{u.email.slice(0, 20)}{u.email.length > 20 && "..."}</p>
                  <p><strong>Latitude: </strong>{u.location.lat}</p>
                  <p><strong>Longitude: </strong>{u.location.lng}</p>
                </motion.section>
              ))}
            </motion.section>
          </div>
        : 
          <motion.section
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="relative z-10  bg-white/10 backdrop-blur-md p-12 rounded-md max-w-3xl text-center shadow-lg border border-white/20 mb-4"
          >
            <p className="text-blue-600"><strong>No Active Users</strong></p>
          </motion.section>
      }
    </div>
  );
}
