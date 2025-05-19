import {motion} from 'framer-motion'
import { useEffect, useState } from 'react'
import {io} from "socket.io-client"

const socket = io(import.meta.env.VITE_PUBLIC_API_URL);

function Map() {

    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [securityKey, setSecurityKey] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [userLocations, setUserLocations] = useState([]);

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
        className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-gray-500 to-sky-500 p-6"
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
                <div>
                    {userLocations.map((u) => console.log(u.email))}
                </div>
            
        }
    </motion.div>
  )
}

export default Map