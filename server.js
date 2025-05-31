require('dotenv').config(); // Add this line at the top
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Basic API endpoint example (optional, can be removed later)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Star Vision IT Solutions API!' });
});

// Import routes
const servicesRouter = require('./routes/services');
const enquiriesRouter = require('./routes/enquiries'); // Add this

// Use routes
app.use('/api/services', servicesRouter);
app.use('/api/enquiries', enquiriesRouter); // Add this

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

