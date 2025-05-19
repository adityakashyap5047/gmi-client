import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '80vh',
};

// Replace with your Google Maps API key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_PUBLIC_GOOGLE_MAP_API_KEY;

// Distance per update: 20 meters ≈ 0.00018 degrees
const LAT_INCREMENT = 0.00018;
const UPDATE_INTERVAL = 50; // in ms
const STEPS = 20; // 20 steps per second (1s / 50ms)

const SmoothMovingMarker = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [position, setPosition] = useState({
    lat: 28.6139,
    lng: 77.2090,
  });

  const stepRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      stepRef.current += 1;

      setPosition((prev) => ({
        ...prev,
        lat: prev.lat + LAT_INCREMENT / STEPS,
      }));
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position}
      zoom={16}
      options={{
        disableDefaultUI: true,
        draggable: false,
        keyboardShortcuts: false,
      }}
    >
      <Marker position={position} />
    </GoogleMap>
  );
};

export default SmoothMovingMarker;