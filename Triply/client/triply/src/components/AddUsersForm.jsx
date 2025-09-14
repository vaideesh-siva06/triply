import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { EmailContext } from './Settings';


export default function AddUsersForm({ setUserModal, resetModal, setEditingId, itineraryId }) {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  // Email validation function
  const isValidEmail = (email) => {
    // Simple regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Disable background scrolling when modal is open and fetch user email
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    axios.get('http://localhost:5001/info', { withCredentials: true })
      .then(res => {
        setCurrentUserEmail(res.data.email || "");
      })
      .catch(() => setCurrentUserEmail(""));
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Only allow a single email input
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setInputError("");
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    setInputError("");
    const email = inputValue.trim();
    if (!email) {
      setInputError("Please enter an email address.");
      return;
    }
    else if (!isValidEmail(email)) {
      setInputError("Please enter a valid email address.");
      return;
    }
    else if (email.toLowerCase() === currentUserEmail.toLowerCase()) {
      setInputError("You cannot share an itinerary with yourself.");
      return;
    }
    else
    {
        axios.post(`http://localhost:5001/itinerary/${itineraryId}/share-itinerary`, { email })
        .then(res => {
            setInputValue("");
            alert("Shared successfully!");
        })
        .catch(err => {
            setInputError(err.response?.data?.error || "Failed to add user");
        });
    }

  };

  return (
    <form
      onSubmit={handleAddUser}
      className="bg-white rounded-2xl p-4 md:p-8 max-w-4xl mx-auto space-y-8 border border-gray-200 relative">
      {/* Close button */}
      <button
        type="button"
        className="absolute top-3 right-3 cursor-pointer text-gray-500 hover:text-gray-700 text-2xl font-bold"
        onClick={() => {
          setUserModal(false);
          resetModal();
          setEditingId(null);
        }}
        aria-label="Close"
      >
        &times;
      </button>


      <h1 className="text-2xl font-bold text-gray-800 mb-6">Share</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-x-12">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
          <input
            type="email"
            placeholder="Enter user email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
            value={inputValue}
            onChange={handleInputChange}
            autoFocus
          />
          {inputError && (
            <span className="text-red-500 block w-full mt-1">{inputError}</span>
          )}
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          className="mt-2 bg-black text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-200"
        >
          Share
        </button>
      </div>
    </form>
  );
}