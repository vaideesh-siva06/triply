import express from 'express';
import { createItinerary, deleteItinerary, getItineraries, updateItinerary, shareItinerary } from '../controllers/itineraryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/create-itinerary", authMiddleware, createItinerary);
router.get("/get-itineraries", authMiddleware, getItineraries);
router.put("/:id/update-itinerary", authMiddleware, updateItinerary);
router.delete("/:id/delete-itinerary", authMiddleware, deleteItinerary);
router.post("/:id/share-itinerary", shareItinerary);

export default router;