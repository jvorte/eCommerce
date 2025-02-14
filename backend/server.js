const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();


app.use(express.json());
app.use(cors());

// Σύνδεση με MongoDB
const mongoURI = 'mongodb://localhost:27017/e-commerce'; // Χρησιμοποίησε την σωστή πόρτα και την βάση δεδομένων


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Route για την αρχική σελίδα
app.get('/', (req, res) => {
  res.send('Welcome to the E-Commerce API!');
});

// POST route για δημιουργία χρήστη
const User = require('./db/User'); // Εισαγωγή του User μοντέλου
app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error); // Πρόσθεσε αυτό για να καταγράψεις το σφάλμα
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Route για login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});



// Χειρισμός 404 (για μη υπάρχοντα routes)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Εκκίνηση του server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
