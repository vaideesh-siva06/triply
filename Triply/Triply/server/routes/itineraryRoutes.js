import express from 'express';
import { createItinerary, deleteItinerary, getItineraries, updateItinerary } from '../controllers/itineraryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/create-itinerary", authMiddleware, createItinerary);
router.get("/get-itineraries", authMiddleware, getItineraries);
router.put("/:id/update-itinerary", authMiddleware, updateItinerary);
router.delete("/:id/delete-itinerary", authMiddleware, deleteItinerary);

export default router;