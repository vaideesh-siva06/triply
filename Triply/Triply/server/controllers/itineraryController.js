import db from '../db/db.js';

export const createItinerary = (req, res) => {
    
    const { title, locations, excursions, description, startDate, endDate, aiPrompt, budget, numTravelers, aiSuggestions } = req.body;

     const sql = `INSERT INTO Itineraries 
        (title, description, creator_id, start_date, end_date, locations, excursions, budget, numTravelers, aiPrompt, aiSuggestions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        title,
        description,
        req.userId,
        startDate,
        endDate,
        JSON.stringify(Array.isArray(locations) ? locations : []),
        JSON.stringify(Array.isArray(excursions) ? excursions : []),
        budget,
        numTravelers,
        aiPrompt,
        aiSuggestions || null
    ]

   db.query(sql, values, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(200).json({ message: "Itinerary added successfully", id: results.insertId });
  });

}

export const getItineraries = (req, res) => {

    const sql = `
    SELECT id, title, description, start_date, end_date, locations, excursions, budget, numTravelers, aiPrompt, aiSuggestions
    FROM Itineraries
    WHERE creator_id = ?`;

    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }

    db.query(sql, [req.userId], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    });

}

export const updateItinerary = (req, res) => {
  const itineraryId = req.params.id;
  const userId = req.userId;

  const {
    title,
    description,
    locations,
    excursions,
    startDate,
    endDate,
    budget,
    numTravelers,
    aiPrompt,
    aiSuggestions
  } = req.body;

   if (!title || !startDate || !endDate) {
    return res.status(400).json({ error: "Title, start date, and end date are required." });
  }

  const sql = `
    UPDATE Itineraries
    SET title = ?, description = ?, locations = ?, excursions = ?, start_date = ?, end_date = ?, budget = ?, numTravelers = ?, aiPrompt = ?, aiSuggestions = ?
    WHERE id = ? AND creator_id = ?
  `;

  const values = [
    title,
    description || null,
    JSON.stringify(locations || []),
    JSON.stringify(excursions || []),
    startDate,
    endDate,
    budget || null,
    numTravelers || 1,
    aiPrompt || null,
    aiSuggestions || null,
    itineraryId,
    userId
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error updating itinerary" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Itinerary not found or not authorized" });
    }

    res.json({ message: "Itinerary updated successfully" });
  });


}

export const deleteItinerary = (req, res) => {
  const itineraryId = req.params.id;

  const sql = `
    DELETE FROM Itineraries
    WHERE id = ?
  `;
   
   db.query(sql, itineraryId, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error deleting itinerary" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Itinerary not found or not authorized" });
    }

    res.json({ message: "Itinerary deleted successfully" });
  });

}