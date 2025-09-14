import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { CalendarDays } from "lucide-react";
import { GoogleGenerativeAI } from '@google/generative-ai';
import DownloadButton from './DownloadButton';
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export default function ItineraryForm({
  title, setTitle,
  locations, setLocations,
  excursions, setExcursions,
  description, setDescription,
  startDate, setStartDate,
  endDate, setEndDate,
  extraInfo, setExtraInfo,
  numTravelers, setNumTravelers,
  aiPrompt, setAIPrompt,
  createItinerary,
  updateItinerary,
  setShowModal,
  resetModal,
  budget, setBudget,
  setEditingId, editingId,
  setAiSuggestions, aiSuggestions
}) {

  const today = new Date().toISOString().split("T")[0];
  const [suggestions, setSuggestions] = useState({});
  const [query, setQuery] = useState({});
  const [debouncedQuery, setDebouncedQuery] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const genAI = new GoogleGenerativeAI(apiKey);


  const getResponseForGivenPrompt = async (prompt) => {
    // If suggestions are on, validate locations normally
    if (showSuggestions) {
      if (!title || !locations.every((loc) => loc.trim()) || !startDate || !endDate || !aiPrompt) {
        alert("Please fill out all required fields before generating AI suggestions.");
        return;
      }
    } else {
      // Suggestions off: only require that each location has some text
      if (!title || locations.filter(loc => loc.trim()).length === 0 || !startDate || !endDate || !aiPrompt) {
        alert("Please fill out all required fields before generating AI suggestions off.");
        return;
      }
    }

    try {
      setLoading(true);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);

      const response = await result.response;
      const text = await response.text();
      
      const newSuggestion = text;
      const updatedSuggestions = [...aiSuggestions, newSuggestion];
      setAiSuggestions(updatedSuggestions);

      if (editingId) {
        await updateItinerary(editingId, updatedSuggestions);
      } else {
        await createItinerary(updatedSuggestions);
      }
    } catch (err) {
      console.error("Something went wrong:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const handlers = Object.keys(query).map((idx) => {
        const timeout = setTimeout(() => {
            setDebouncedQuery((prev) => ({...prev, [idx]: query[idx]}))
        }, 300)
        return { idx, timeout }
    })

     return () => handlers.forEach((h) => clearTimeout(h.timeout));
  }, [query])

  useEffect(() => {
        if (aiSuggestions.length > 0) {
            // Close modal
            setShowModal(false);
            // Reload page
            window.location.reload();
        }
    }, [aiSuggestions, setShowModal]);

  useEffect(() => {
    Object.entries(debouncedQuery).forEach(async ([idx, value]) => {
      if (!value || value.length < 1) {
        setSuggestions((prev) => ({ ...prev, [idx]: [] }));
        return;
      }

      const cache = {}; // outside component

        if (cache[value]) {
            setSuggestions((prev) => ({ ...prev, [idx]: cache[value] }));
            return;
        }

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1&limit=5`
      );
      const data = await res.json();

      const formattedSuggestions = data
        .map((location) => {

            return {
                id: location.place_id,
                name: location.display_name, 
                fullName: location.display_name,              
                lat: location.lat,
                lon: location.lon,
                address: location.address,
            };
        })

        .filter((loc) => !locations.includes(loc.fullName));
        cache[value] = formattedSuggestions;


        setSuggestions((prev) => ({ ...prev, [idx]: formattedSuggestions }));
    });
  }, [debouncedQuery]);

    const handleSelect = (idx, place) => {
      const newLocations = [...locations];
      newLocations[idx] = place.fullName;
      setLocations(newLocations);
      console.log("LOCATION SET!");

      setQuery((prev) => ({ ...prev, [idx]: "" }));
      setSuggestions((prev) => ({ ...prev, [idx]: [] }));
      setDebouncedQuery((prev) => ({ ...prev, [idx]: "" }));
    };





    const buildPromptFromForm = () => {
        return `
        Please help me plan a trip with the following details:

        • Title: ${title}
        • Description: ${description || "N/A"}
        • Locations: ${locations.length > 0 ? locations.join(", ") : "N/A"}
        • Excursions: ${excursions.length > 0 ? excursions.join(", ") : "N/A"}
        • Start Date: ${startDate || "N/A"}
        • End Date: ${endDate || "N/A"}
        • Number of Travelers: ${numTravelers || "N/A"}
        • Budget: ${budget ? `$${budget}` : "N/A"}
        • Extra Info: ${aiPrompt || "N/A"}

        Based on this information, generate a suggested itinerary with highlights, recommendations, and possible activities.
        
        Also, add a table of contents for the pdf and for each location have a google maps clickable link!
        `;
    };


  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        try {
          // Check required locations depending on whether suggestions are enabled
          if (showSuggestions) {
            // suggestions enabled, normal validation
            if (locations.some((loc) => !loc.trim())) {
              alert("All location fields are required.");
              return;
            }
          } else {
            // suggestions disabled, only require some input
            if (locations.some((loc) => !loc.trim())) {
              alert("All location fields are required.");
              return;
            }
          }

          await getResponseForGivenPrompt(buildPromptFromForm()); 
          setShowModal(false);
          resetModal();

        } catch (error) {
          console.error("Error creating itinerary:", error);
          alert("There was an error creating the itinerary. Please try again.");
        }
      }}
      className="bg-white rounded-2xl p-4 md:p-8 max-w-4xl mx-auto space-y-8 border border-gray-200 relative"
    >
  {/* Close button */}
  <button
    type="button"
    className="absolute top-3 right-3 cursor-pointer text-gray-500 hover:text-gray-700 text-2xl font-bold"
    onClick={() => {
      setShowModal(false);
      setEditingId(null);
      resetModal();
    }}
    aria-label="Close"
  >
    &times;
  </button>

  <h1 className="text-2xl font-bold text-gray-800 mb-6">{editingId ? "Update Itinerary" : "Create New Itinerary"}</h1>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-x-12">
    {/* Left Column */}
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          placeholder="Trip title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <i className="text-gray-500">(Optional)</i>
        </label>
        <textarea
          value={description}
          placeholder="Add a description..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 resize-none"
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      {/* Extra Info */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          AI Prompt <i className="text-gray-500">(Required)</i>
        </label>
        <textarea
          value={aiPrompt}
          placeholder="Add any extra information or specifications..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 resize-none"
          onChange={(e) => setAIPrompt(e.target.value)}
          required
        ></textarea>
      </div>

      <div className="space-y-6">
        {/* Checkbox for suggestions */}
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={showSuggestions}
            onChange={(e) => setShowSuggestions(e.target.checked)}
            id="toggleSuggestions"
            className="w-4 h-4"
          />
          <label htmlFor="toggleSuggestions" className="text-sm text-gray-700 italic">
            Suggestions On? <i>(Suggestions may be slow)</i>
          </label>
        </div>

        

       {/* Locations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Locations <i className="text-gray-500">(max 5)</i></label>
          {locations.map((loc, idx) => (
            <div key={idx} className="relative flex items-center w-full">
              <FaMapMarkerAlt className="absolute left-2 top-1/2 -translate-y-1/2 text-red-400 mt-2" />

              <input
                type="text"
                value={locations[idx] || ""}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  // Update query for suggestions (if enabled)
                  setQuery((prev) => ({ ...prev, [idx]: inputValue }));

                  // Update the locations array so typing works even when suggestions are off
                  const newLocations = [...locations];
                  newLocations[idx] = inputValue;
                  setLocations(newLocations);

                  // If suggestions are off, clear them
                  if (!showSuggestions) {
                    setSuggestions((prev) => ({ ...prev, [idx]: [] }));
                  }
                }}
                className="w-full border p-2 rounded pl-8 pr-8 mt-4"
              />

              {/* Remove button */}
              {locations.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setLocations(locations.filter((_, i) => i !== idx))
                  }
                  className="absolute right-2 top-1/2 mt-1.5 -translate-y-1/2 text-red-500 hover:text-red-700 text-xl font-bold"
                >
                  &times;
                </button>
              )}

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions[idx]?.length > 0 && (
                <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 mt-1 rounded-lg max-h-40 overflow-y-auto shadow-lg">
                  {suggestions[idx].map((place) => (
                    <li
                      key={place.id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelect(idx, place)}
                    >
                      {place.fullName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}


          <button
            type="button"
            disabled={locations.length >= 5}
            className={`mt-2 text-sm font-semibold ${
              locations.length >= 5
                ? "text-gray-400 cursor-not-allowed"
                : "text-black hover:text-gray-700"
            }`}
            onClick={() => {
              if (locations.length < 5) setLocations([...locations, ""]);
            }}
          >
            + Add Location
          </button>
        </div>
      </div>
    </div>

    {/* Right Column */}
    <div className="space-y-6">
      {/* Excursions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excursions <i className="text-gray-500">(Optional, max 5)</i>
        </label>
        {excursions.map((exc, idx) => (
          <div key={idx} className="flex items-center gap-3 mb-2">
            <input
              type="text"
              placeholder={`Excursion ${idx + 1}`}
              value={exc}
              onChange={(e) => {
                const newExc = [...excursions];
                newExc[idx] = e.target.value;
                setExcursions(newExc);
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {excursions.length > 1 && (
              <button
                type="button"
                onClick={() => setExcursions(excursions.filter((_, i) => i !== idx))}
                className="text-red-500 hover:text-red-700 text-xl font-bold px-2"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          disabled={excursions.length >= 5}
          className={`mt-2 text-sm font-semibold ${
            excursions.length >= 5
              ? "text-gray-400 cursor-not-allowed"
              : "text-black hover:text-gray-700"
          }`}
          onClick={() => {
            if (excursions.length < 5) setExcursions([...excursions, ""]);
          }}
        >
          + Add Excursion
        </button>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            min={today}
            max={endDate || undefined}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition duration-200 text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={startDate || today}
          />
        </div>
      </div>

      {/* Number of Travelers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Travelers</label>
        <input
          type="number"
          min="1"
          value={numTravelers}
          onChange={(e) => setNumTravelers(e.target.value)}
          placeholder="Enter number of travelers"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Budget */}
     <label className="block text-sm font-medium text-gray-700 mb-1">Budget <i>(Optional, but recommended)</i></label>
     <div className="relative w-full">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
        <input
            type="number"
            min="0"
            value={budget}
            onKeyDown={(e) => {
                if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                    e.preventDefault();
                }
            }}
            onChange={(e) => {
                const value = e.target.value;

                if (/e|\+|\-/.test(value)) return;
                setBudget(value)
            }}
            placeholder="Enter total budget"
            className="w-full pl-7 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>
    </div>
  </div>

        <div className="pt-6">
            <button
                type="button"
                onClick={() => getResponseForGivenPrompt(buildPromptFromForm())}
                className="mt-2 bg-black text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-200"
                disabled={loading}
            >
                {loading ? "Generating..." : "Get AI Suggestions"}
            </button>
            </div>
    </form>

  );
}