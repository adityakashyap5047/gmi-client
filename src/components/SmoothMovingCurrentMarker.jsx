import { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '80vh',
};

const interpolate = (start, end, factor) => {
  return start + (end - start) * factor;
};

const interpolatePosition = (start, end, factor) => ({
  lat: interpolate(start.lat, end.lat, factor),
  lng: interpolate(start.lng, end.lng, factor),
});

const SmoothMovingCurrentMarker = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAP_API_KEY,
  });

  const [smoothLocation, setSmoothLocation] = useState(null);
  const [error, setError] = useState(null);
  const requestRef = useRef();
  const prevLocationRef = useRef();

  useEffect(() => {
    let watchId;

    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          if (!prevLocationRef.current) {
            // Set initial values   
            setSmoothLocation(newLoc);
            prevLocationRef.current = newLoc;
            return;
          }

          // Set new target location
          animateTransition(prevLocationRef.current, newLoc);
          prevLocationRef.current = newLoc;
        },
        (err) => {
          setError('Permission denied or error getting location');
          console.error(err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 5000,
        }
      );
    } else {
      setError('Geolocation not supported by your browser.');
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Smooth animation function
  const animateTransition = (from, to) => {
    let startTime = null;
    const duration = 1000; // 1 second

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const newPosition = interpolatePosition(from, to, progress);
      setSmoothLocation(newPosition);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
  };

  if (!isLoaded) return <div>Loading Map...</div>;
  if (error) return <div>{error}</div>;
  if (!smoothLocation) return <div>Getting your location...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={smoothLocation}
      zoom={15}
    >
      <Marker position={smoothLocation} />
    </GoogleMap>
  );
};

export default SmoothMovingCurrentMarker;