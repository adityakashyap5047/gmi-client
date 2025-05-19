import React, { useEffect, useState, } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '80vh',
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_PUBLIC_GOOGLE_MAP_API_KEY;

// Starting location: Delhi
const INITIAL_MARKER_POSITION = {
  lat: 28.6139,
  lng: 77.2090,
};

const LAT_INCREMENT = 0.00018; // approx 20 meters
const UPDATE_INTERVAL = 1000;  // every second

const StickyMapMovingMarker = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [markerPosition, setMarkerPosition] = useState(INITIAL_MARKER_POSITION);
  const [userLocation, setUserLocation] = useState(null);

  // Simulate marker movement every second
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkerPosition((prev) => ({
        ...prev,
        lat: prev.lat + LAT_INCREMENT,
      }));
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Track real user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error('Error getting location:', err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 5000,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      alert('Geolocation not supported');
    }
  }, []);

  if (!isLoaded || !userLocation) return <div>Loading map or location...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={userLocation} // Map follows your real location
      zoom={16}
    >
      <Marker position={markerPosition} />
    </GoogleMap>
  );
};

export default StickyMapMovingMarker;