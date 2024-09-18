const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');

// Import your routes
const productRoutes = require('./routes/productRoutes');
const storeRoutes = require('./routes/storeRoutes');
const poRoutes = require('./routes/poRoutes');
const soRoutes = require('./routes/soRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const srRoutes = require('./routes/srRoutes');
const emptyRoute = require('./routes/emptyRoute');
const userRoute = require('./routes/userRoute');

const app = express();
const port = 5010;

// Define allowed origins
const allowedOrigins = ['https://bellapacx.github.io']; // Adjust as needed

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true, // Allow credentials (cookies) to be sent
}));

app.use(express.json());
app.use(bodyParser.json());

// Configure MongoDB session store
const mongoUrl = 'mongodb+srv://bella:bellamongo@cluster0.n3ihytm.mongodb.net/sge?retryWrites=true&w=majority&appName=Cluster0'; // Update to your MongoDB URL
const sessionStore = MongoStore.create({
  mongoUrl,
  collectionName: 'sessions', // Optional: default is 'sessions'
});

// Configure express-session
app.use(session({
  secret: 'your-secret-key', // Replace with a more secure key in production
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: true, // Set to true if using HTTPS
    sameSite: 'None', // Adjust as needed
    maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
  },
}));

// Define API routes
app.use('/api', productRoutes, storeRoutes, poRoutes, soRoutes, vehicleRoutes, srRoutes, emptyRoute, userRoute);

// Connect to MongoDB
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error: any) => console.error('Could not connect to MongoDB:', error));

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
