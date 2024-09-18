const express = require('express');
//import mongoose from 'mongoose';
const mongoose = require('mongoose');
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import productRoutes from './routes/productRoutes';
import storeRoutes from './routes/storeRoutes';
import poRoutes from './routes/poRoutes';
import soRoutes from './routes/soRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import srRoutes from './routes/srRoutes';
import emptyRoute from './routes/emptyRoute';
import userRoute from './routes/userRoute';
import bodyParser from 'body-parser';

const app = express();
const port = 5010;

const allowedOrigins = ['https://bellapacx.github.io']; // Add other origins if needed
// Middleware
// CORS Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(bodyParser.json());
// Configure allowed origins


// Configure MongoDB session store
const mongoUrl = 'mongodb+srv://bella:bellamongo@cluster0.n3ihytm.mongodb.net/sge?retryWrites=true&w=majority&appName=Cluster0'; // Update to your MongoDB URL
const sessionStore = MongoStore.create({
  mongoUrl,
  collectionName: 'sessions', // Optional: default is 'sessions'
});

// Configure express-session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: true, // Use true when serving over HTTPS (your case with GitHub Pages)
    httpOnly: true,
    sameSite: 'None', // Important for cross-origin requests
    maxAge: 24 * 60 * 60 * 1000 // Optional: set cookie expiration
  }
}));

// Routes
app.use('/api', productRoutes, storeRoutes, poRoutes, soRoutes, vehicleRoutes, srRoutes, emptyRoute, userRoute);

// Connect to MongoDB
mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error: any) => console.error('Could not connect to MongoDB:', error));

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
