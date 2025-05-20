import {motion} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {io} from "socket.io-client"
import MapTracking from './mapTracking';
import { useUser } from '../../context/UserContext';

const socket = io(import.meta.env.VITE_PUBLIC_API_URL);

function Map() {

    const { user } = useUser();
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [securityKey, setSecurityKey] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
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

    const handleSubmit = async (e) => {
        e.preventDefault();  
        setIsSubmitting(true)
        if(!securityKey) {
            setError("Please, Enter the Security Key.");
            setSuccess(false);
            setIsSubmitting(false);
            return
        }
        if(securityKey === import.meta.env.VITE_PUBLIC_SECURITY_KEY){
            setError("")
            setSuccess(true);
        } else {
            setError("Invalid Security Key! Please, try again.")
            setSuccess(false);
        }
        setSecurityKey("")
        setIsSubmitting(false)
    }

  return (
    <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0d47ce] via-[#034470] to-[#2dc1d1] p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
    >
        {!success ? 
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-8 max-w-md w-full shadow-lg">
                <p className="bg-gray-600 text-gray-200 p-2 mb-4 rounded text-center">
                    Enter the Security Key to Access the Map
                </p>
                <label htmlFor="email" className="block text-white font-semibold mb-1">
                    Security Key
                </label>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input
                        value={securityKey}
                        onChange={(e) => setSecurityKey(e.target.value)}
                        className={`w-full px-4 py-2 rounded-md bg-white/70 focus:outline-none `}
                        placeholder="abcd1234"
                        type="password"
                    />
                    {error && (
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-6 cursor-pointer bg-sky-600 hover:bg-sky-700 transition text-white font-semibold py-3 rounded-md shadow-md disabled:opacity-60"
                    >
                        Proceed
                    </button>
                </form>
                <p className='mt-8 text-cyan-900 font-semibold'>Don't have Security Key? Contact to Admin</p>
            </div>
            :  
            <>
                {userLocations.length > 0 ? <MapTracking locations={userLocations.map((u) => u.location)}/> : <p>Loading...</p>}
            </>

        }
    </motion.div>
  )
}

export default Map