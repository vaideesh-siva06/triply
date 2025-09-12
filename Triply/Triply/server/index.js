import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db/db.js';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import authRoutes from './routes/authRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';
import { authMiddleware } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5001;

app.use("/", authRoutes);
app.use("/itinerary", itineraryRoutes);

app.get("/info", authMiddleware, (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Not authenticated" });
  const sql = "SELECT id, username, email FROM users WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    res.json(results[0]);
  });
});

app.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax', 
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({ message: 'Logged out' });
});

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}!`);
})