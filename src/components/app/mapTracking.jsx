import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useUser } from '../../context/UserContext';

const containerStyle = {
  width: '100vw',
  height: '80vh'
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_PUBLIC_GOOGLE_MAP_API_KEY;

const MapTracking = ({ locations }) => {
  
  const {user} = useUser(); 

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading Map...</div>;

  const defaultCenter = user?.location
    ? { lat: user.location.lat, lng: user.location.lng }
    : { lat: locations[0].lat, lng: locations[0].lng };

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

export default MapTracking;