import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '80vh'
};

// Replace with your actual API Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_PUBLIC_GOOGLE_MAP_API_KEY;

const MultipleMarkers = ({ locations }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading Map...</div>;

  // Center the map to the first location or a default value
  const defaultCenter = locations.length > 0
    ? { lat: locations[0].lat, lng: locations[0].lng }
    : { lat: 0, lng: 0 };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={5}
    >
      {locations.map((loc, index) => (
        <Marker
          key={index}
          position={{ lat: loc.lat, lng: loc.lng }}
          label={(index + 1).toString()}
        />
      ))}
    </GoogleMap>
  );
};

export default MultipleMarkers;