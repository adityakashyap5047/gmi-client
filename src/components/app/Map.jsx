import {motion} from 'framer-motion'

function Map() {
  return (
    <motion.div
          className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-gray-500 to-sky-500 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
    ></motion.div>
  )
}

export default Map