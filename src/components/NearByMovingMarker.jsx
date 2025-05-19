import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '80vh',
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_PUBLIC_GOOGLE_MAP_API_KEY;
const LAT_INCREMENT = 0.00018; // ~20 meters per second
const UPDATE_INTERVAL = 1000;  // 1 second
const MAX_DISTANCE_KM = 200;

// Your simulated location is Patna
const PATNA_COORDS = {
  lat: 25.5941,
  lng: 85.1376,
};

// Initial marker positions (Delhi, Lucknow, Ranchi)
const INITIAL_MARKERS = [
  { id: 1, name: 'Delhi', position: { lat: 28.6139, lng: 77.2090 } },
  { id: 2, name: 'Lucknow', position: { lat: 26.8467, lng: 80.9462 } },
  { id: 3, name: 'Ranchi', position: { lat: 23.3441, lng: 85.3096 } },      
  { id: 4, name: 'Random', position: { lat: 25.3441, lng: 85.3096 } },      
];

// Haversine formula to calculate distance in km
function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const NearbyMovingMarker = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [myLocation, setMyLocation] = useState(PATNA_COORDS);
  const [markers, setMarkers] = useState(INITIAL_MARKERS);

  // Update markers every second (simulate movement north)
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkers((prevMarkers) =>
        prevMarkers.map((marker) => ({
          ...marker,
          position: {
            ...marker.position,
            lat: marker.position.lat + LAT_INCREMENT,
          },
        }))
      );
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Track real location (optional: can use actual GPS)
  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setMyLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // If GPS fails, fallback to Patna
          setMyLocation(PATNA_COORDS);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  if (!isLoaded || !myLocation) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={myLocation}
      zoom={7}
    >
      {/* Marker: Your Location */}
      <Marker position={myLocation} label="You" />

      {/* Other Moving Markers within 200 km */}
      {markers.map((marker) => {
        const distance = getDistanceInKm(
          myLocation.lat,
          myLocation.lng,
          marker.position.lat,
          marker.position.lng
        );

        if (distance <= MAX_DISTANCE_KM) {
          return (
            <Marker
              key={marker.id}
              position={marker.position}
              label={marker.name}
            />
          );
        }
        return null;
      })}
    </GoogleMap>
  );
};

export default NearbyMovingMarker;