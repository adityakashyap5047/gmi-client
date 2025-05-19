import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useUser } from "../context/UserContext";

const socket = io(import.meta.env.VITE_PUBLIC_API_URL);

export default function LiveTracking() {
  const { user } = useUser();
  const [userLocations, setUserLocations] = useState([]);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!user || !user._id) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      setUserLocations([]);
      return;
    }

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

    return () => {
      navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [user]);

  useEffect(() => {
    const handleLocationData = (locations) => {
      setUserLocations(locations);
    };

    socket.on("location-data", handleLocationData);

    return () => {
      socket.off("location-data", handleLocationData);
    };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Live User Coordinates</h2>
      {userLocations.length === 0 ? (
        <p>No active users...</p>
      ) : (
        <ul className="space-y-3">
          {userLocations.map((u) => (
            <li key={u._id} className="bg-white text-black shadow rounded p-4">
              <p><strong>Email:</strong> {u.email}</p>
              <p><strong>Latitude:</strong> {u.location.lat}</p>
              <p><strong>Longitude:</strong> {u.location.lng}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
