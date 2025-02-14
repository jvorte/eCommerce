const mongoose = require('mongoose');

// Σύνδεση με MongoDB (connection string)
const mongoURI = 'mongodb://localhost:27017/e-commerce';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

