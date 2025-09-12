
import { Link } from 'react-router-dom';
import { FaQuestionCircle } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-200 px-4">
      <div className="flex flex-col items-center bg-white border border-black rounded-xl p-10 md:p-16">
        <FaQuestionCircle className="text-black text-6xl mb-4" />
        <h1 className="text-7xl font-extrabold text-black mb-2">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">Oops! Page not found.</h2>
        <p className="text-gray-700 mb-8 text-center max-w-md">The page you are looking for doesn't exist or has been moved. Let's get you back on track!</p>
        <Link to="/" className="inline-block bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg border border-black transition duration-200">Go Back Home</Link>
      </div>
    </div>
  );
}
