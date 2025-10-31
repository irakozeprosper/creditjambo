import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-gray-100 dark:from-blue-900 dark:to-gray-800">
      <div className="text-center">
        <motion.img
          src="https://yemca-services.net/404.png"
          alt="404 Illustration"
          className="mx-auto w-80 shadow-xl rounded-lg"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
        <h1 className="text-7xl font-extrabold text-blue-700 dark:text-blue-400 mt-6">
          Looks Like You're Lost!
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mt-2">
          We can't seem to find the page you're looking for.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transform transition hover:scale-105 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
