import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useUser } from "../context/UserContext";

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Live User Coordinates</h2>
        <button
          className={`px-4 py-2 rounded text-white ${
            visible ? "bg-green-600" : "bg-gray-400"
          }`}
          onClick={toggleVisibility}
        >
          {visible ? "Visible" : "Hidden"}
        </button>
      </div>

      {userLocations.length === 0 ? (
        <p>No active users...</p>
      ) : (
        <ul className="space-y-3">
          {userLocations.map((u) => (
            <li key={u._id} className="bg-white text-black shadow rounded p-4">
              <p>
                <strong>Email:</strong> {u.email}
              </p>
              <p>
                <strong>Latitude:</strong> {u.location.lat}
              </p>
              <p>
                <strong>Longitude:</strong> {u.location.lng}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
