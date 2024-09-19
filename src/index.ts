const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');

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

const allowedOrigins = ['https://bellapacx.github.io']; // Add other origins if needed

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());

// Configure express-session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true when serving over HTTPS
    httpOnly: true,
    sameSite: 'lax' // Use 'lax' or 'strict' based on your needs
  }
}));

// Routes
app.use('/api', productRoutes, storeRoutes, poRoutes, soRoutes, vehicleRoutes, srRoutes, emptyRoute, userRoute);

// Connect to MongoDB
const mongoUrl = 'mongodb+srv://bella:bellamongo@cluster0.n3ihytm.mongodb.net/sge?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error: any) => console.error('Could not connect to MongoDB:', error));

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
