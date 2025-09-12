import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import ItineraryForm from './ItineraryForm';
import { motion, AnimatePresence } from "framer-motion";
import DownloadButton from './DownloadButton';
const api = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [activeTab, setActiveTab] = useState('my');
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [locations, setLocations] = useState(['']); 
  const [excursions, setExcursions] = useState(['']);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [aiPrompt, setAIPrompt] = useState('');
  const [numTravelers, setNumTravelers] = useState(1);
  const [itineraries, setItineraries] = useState([]);
  const [editingId, setEditingId] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);


  const resetModal = () => {
    setTitle('');
    setLocations(['']);
    setExcursions(['']);
    setDescription('');
    setStartDate('');
    setEndDate('');
    setBudget('');
    setNumTravelers(1);
    setAIPrompt('');
    setEditingId('');
  };

  useEffect(() => {
    document.title = "Dashboard";
    axios.get(`http://localhost:5001/info`, { withCredentials: true })
    .then(res => {
      setName(`Welcome, ${res.data.username}!`);
    }).catch(err => console.log(err))

    axios.get(`http://localhost:5001/itinerary/get-itineraries`, { withCredentials: true })
    .then(res => {
      setItineraries(res.data);
    })
    .catch(err => console.log(err));

    }, []);


  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const createItinerary = async (aiSuggestionsToSave = aiSuggestions) => {
    try {
      // Ensure aiSuggestions is either a non-empty array or null
      const safeAiSuggestions = aiSuggestionsToSave && aiSuggestionsToSave.length > 0 
                                ? aiSuggestionsToSave 
                                : null;

      // POST to create itinerary
      const createRes = await axios.post(
        `http://localhost:5001/itinerary/create-itinerary`,
        {
          title,
          description: description || null,
          startDate,
          endDate,
          locations: Array.isArray(locations) ? locations : [],
          excursions: Array.isArray(excursions) ? excursions : [],
          numTravelers,
          budget: budget || null,
          aiPrompt: aiPrompt || null,
          aiSuggestions: safeAiSuggestions
        },
        { withCredentials: true }
      );


      // GET updated itineraries
      const itinerariesRes = await axios.get(
        `http://localhost:5001/itinerary/get-itineraries`
      );


      // Reset modal & update UI
      resetModal();
      // Ideally update your state here instead of full page reload
      // e.g., setItineraries(itinerariesRes.data);
      window.location.reload();

    } catch (err) {
      console.error("Error creating itinerary:", err);
    }
  };


  const updateItinerary = (id, aiSuggestionsToSave = aiSuggestions) => {
    const safeAiSuggestions = aiSuggestionsToSave && aiSuggestionsToSave.length > 0 
                                ? aiSuggestionsToSave 
                                : null;

    axios.put(`http://localhost:5001/itinerary/${id}/update-itinerary`, {
        title,
        description: description || null,
        startDate,
        endDate,
        locations: Array.isArray(locations) ? locations : [],
        excursions: Array.isArray(excursions) ? excursions : [],
        numTravelers,
        budget: budget || null,
        aiPrompt: aiPrompt || null,
        aiSuggestions: safeAiSuggestions
      },
      { withCredentials: true }
    )
    .then(res => {

      setItineraries(prev =>
        prev.map(itin =>
          itin.id === id ? { ...itin, 
            title, 
            description, 
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            locations,
            excursions, 
            numTravelers, 
            budget, 
            aiPrompt } : itin
        )
      );

      setShowModal(false);
      resetModal();
      setEditingId(null); 
    })
    .catch(err => {
      console.error("Error updating itinerary:", err);
    });
  };

  const handleSubmit = async () => {
    try {
      if (locations.some(loc => !loc.trim())) {
        alert("All location fields are required.");
        return;
      }

      if (editingId) {
        await axios.put(`http://localhost:5001/itinerary/${editingId}/update-itinerary`, {
          title, description, locations, excursions,
          startDate, endDate, numTravelers, budget, aiPrompt
        }, { withCredentials: true });
      } else {
        await axios.post(`http://localhost:5001/itinerary/create-itinerary`, {
          title, description, locations, excursions,
          startDate, endDate, numTravelers, budget, aiPrompt
        }, { withCredentials: true });
      }

      // Refresh itineraries
      const res = await axios.get(`http://localhost:5001/itinerary/get-itineraries`, { withCredentials: true });
      setItineraries(res.data);

      setShowModal(false);
      resetModal();
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };


  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0]; // "YYYY-MM-DD"
  };

  const handleEdit = (itinerary) => {
    setTitle(itinerary.title);
    setDescription(itinerary.description || "");
    setLocations(itinerary.locations || [""]);
    setExcursions(itinerary.excursions || [""]);
    setAIPrompt(itinerary.aiPrompt || "");
    setStartDate(itinerary.start_date ? new Date(itinerary.start_date).toISOString().split("T")[0] : "");
    setEndDate(itinerary.end_date ? new Date(itinerary.end_date).toISOString().split("T")[0] : "");
    setBudget(itinerary.budget || "");
    setNumTravelers(itinerary.numTravelers || 1);
    setShowModal(true);
    setEditingId(itinerary.id);
  };



  const deleteItinerary = (id) => {

      axios.delete(`http://localhost:5001/itinerary/${id}/delete-itinerary`, {withCredentials: true})
      .then(res => {
        window.location.reload();
      })
      .catch(err => console.log(err))
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold bg-clip-text mb-8 ml-7">
        {name}
      </h1>
      <div className="flex justify-end max-w-8xl mx-auto px-8">
        <button
          className="bg-white mt-9 hover:bg-black text-black cursor-pointer border-1 hover:text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors duration-200 mb-2"
          onClick={() => setShowModal(true)}
        >
          Create <FaPlus className="w-3 h-3 inline-block ml-1" />
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-white/20 backdrop-blur-sm px-2 md:px-8 py-8 overflow-y-auto"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="rounded-lg p-0 w-full max-w-5xl relative mx-2 md:mx-auto"
            >
              <ItineraryForm
                title={title}
                setTitle={setTitle}
                locations={locations}
                setLocations={setLocations}
                excursions={excursions}
                setExcursions={setExcursions}
                description={description}
                setDescription={setDescription}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                budget={budget}
                setBudget={setBudget}
                numTravelers={numTravelers}
                setNumTravelers={setNumTravelers}
                aiPrompt={aiPrompt}
                setAIPrompt={setAIPrompt}
                editingId={editingId}
                setEditingId={setEditingId}
                aiSuggestions={aiSuggestions}
                setAiSuggestions={setAiSuggestions}

                handleSubmit={handleSubmit}
                createItinerary={createItinerary}
                updateItinerary={updateItinerary}
                setShowModal={setShowModal}
                resetModal={resetModal}
              />

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Tabs */}
      <div className="flex justify-start mt-8">
        <button
          className={`px-9 ml-9 py-3 rounded-t-lg text-lg font-medium focus:outline-none transition-colors duration-200 mx-1
            ${activeTab === 'my' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('my')}
        >
          My Itineraries
        </button>
      </div>
    <div className="bg-white rounded-b-lg p-8 mx-auto max-w-[98%] min-h-[200px] border border-black mb-9">
      {Array.isArray(itineraries) && itineraries.length === 0 ? (
        <p>No trips planned yet — start by creating one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {itineraries?.length > 0 ? (
          itineraries.map((itinerary, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 relative border border-gray-200 hover:shadow-lg transition-shadow duration-200 mb-4"
            >
              <div className="absolute top-3 right-3 flex">
                {/* Edit Button */}
                <button
                  type="button"
                  className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded text-xl"
                  onClick={() => handleEdit(itinerary)}
                >
                  <FaEdit />
                </button>

                {/* Delete Button */}
                <button
                  className="text-black hover:text-gray-500 px-2 py-1 rounded text-xl"
                  title="Delete itinerary"
                  id={itinerary.id}
                  onClick={() => deleteItinerary(itinerary.id)}
                >
                  <FaTrash />
                </button>
              </div>

              <h2 className="text-xl font-bold mb-2 text-gray-800">{itinerary.title}</h2>

              {itinerary.description && (
                <p className="text-gray-600 mb-2">{itinerary.description}</p>
              )}

              <div className="mb-2">
                <span className="font-semibold text-gray-700">Dates: </span>
                <span className="text-gray-600">
                  {new Date(itinerary.start_date).toLocaleDateString()} –{" "}
                  {new Date(itinerary.end_date).toLocaleDateString()}
                </span>
              </div>

              {itinerary.locations?.length > 0 && (
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Locations: </span>
                  <ul className="list-disc list-inside text-gray-600">
                    {itinerary.locations.map((loc, i) => (
                      <li key={i}>{loc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {itinerary.excursions?.filter(exc => exc && exc.trim() !== "").length > 0 && (
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Excursions: </span>
                  <ul className="list-disc list-inside text-gray-600">
                    {itinerary.excursions
                      .filter(exc => exc && exc.trim() !== "")
                      .map((exc, i) => (
                        <li key={i}>{exc}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-between mt-4 text-gray-700 font-medium">
                <span>Travelers: {itinerary.numTravelers || 0}</span>
                <span>Budget: ${itinerary.budget || 0}</span>
              </div>

              <div className="mt-2 cursor-pointer">
                <DownloadButton
                  itinerary={{
                    title: itinerary.title,
                    description: itinerary.description,
                    locations: itinerary.locations,
                    excursions: itinerary.excursions,
                    startDate: itinerary.start_date,
                    endDate: itinerary.end_date,
                    numTravelers: itinerary.numTravelers,
                    budget: itinerary.budget,
                    aiPrompt: itinerary.aiPrompt
                  }}
                  aiSuggestions={[itinerary.aiSuggestions]}
                  isSet={true}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No itineraries found.</p>
      )}
        </div>

      )}
    </div>

    </div>
  );
}

export default Dashboard;