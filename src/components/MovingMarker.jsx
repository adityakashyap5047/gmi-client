import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '80vh',
};

// Replace with your actual API Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_PUBLIC_GOOGLE_MAP_API_KEY;

// Change in latitude for ~20 meters
const LATITUDE_SHIFT = 0.00018;

const MovingMarker = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Starting location (e.g., Delhi)
  const [position, setPosition] = useState({
    lat: 28.6139,
    lng: 77.2090,
  });

  // Update latitude every second
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => ({
        ...prev,
        lat: prev.lat + LATITUDE_SHIFT,
      }));
    }, 1000); // every second

    return () => clearInterval(interval);
  }, []);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position}
      zoom={16}
    >
      <Marker position={position} />
    </GoogleMap>
  );
};

export default MovingMarker;
