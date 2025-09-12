import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ setIsAuthenticated, isAuthenticated }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    axios
      .post("http://localhost:5001/logout", {}, { withCredentials: true })
      .finally(() => {
        setIsAuthenticated(false);
        setDropdownOpen(false);
        navigate("/login");
        window.localStorage.setItem("logout", Date.now());
      });
  };

  return (
    <nav className="w-full flex items-center justify-between py-4 px-8 bg-transparent">
      <Link to="/">
        <img src="/plane.png" alt="Logo" className="w-16" />
      </Link>
      <ul className="flex gap-4 list-none m-0 p-0">
        {isAuthenticated ? (
          <li
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <span className="flex items-center cursor-pointer">
              <FaUserCircle className="text-3xl text-gray-800 hover:text-black transition-colors duration-200" />
            </span>
            {dropdownOpen && (
              <ul className="absolute right-0 mt-0 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <li
                  onClick={() => navigate("/settings")}
                  className="px-5 py-3 font-medium text-gray-900 hover:bg-gray-100 cursor-pointer rounded-b-lg"
                >
                  Settings
                </li>
                <li
                  onClick={handleSignOut}
                  className="px-5 py-3 font-medium text-gray-900 hover:bg-gray-100 cursor-pointer rounded-t-lg"
                >
                  Sign Out
                </li>
              </ul>
            )}
          </li>
        ) : (
          <>
            <Link to="/signup">
              <li className="px-5 py-2 font-medium text-gray-900 border border-gray-900 rounded-lg cursor-pointer bg-white hover:bg-gray-900 hover:text-white transition-colors duration-200">
                Sign Up
              </li>
            </Link>
            <Link to="/login">
              <li className="px-5 py-2 font-medium text-gray-900 border border-gray-900 rounded-lg cursor-pointer bg-white hover:bg-gray-900 hover:text-white transition-colors duration-200">
                Login
              </li>
            </Link>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
