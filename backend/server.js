const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const Product = require('./db/Product');
const User = require('./db/User');
const upload = require('./fileUpload');

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Static files
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/products';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the E-Commerce API!');
});

// Product routes
// Get all products
app.get('/api/products', async (req, res) => {
  console.log("Fetching products...");
  try {
    const products = await Product.find();
    console.log("Products found:", products);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Add new product
app.post('/api/products', upload.single('image'), async (req, res) => {
  const { name, description, price } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !description || !price) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newProduct = new Product({ name, description, price, image });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product', error });
  }
});

// User routes
// Register new user
app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Login
app.post('/api/login', async (req, res) => {
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

// Debug route to check all products
app.get('/api/debug/products', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.json({
      count: products.length,
      products: products
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// 404 handler - Keep this as the last route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Διαγραφή προϊόντος
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Έλεγχος εγκυρότητας του ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Μη έγκυρο format ID προϊόντος' });
    }

    // Έλεγχος αν το προϊόν υπάρχει
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Το προϊόν δεν βρέθηκε' });
    }

    // Διαγραφή προϊόντος
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Το προϊόν διαγράφηκε επιτυχώς' });
  } catch (error) {
    res.status(500).json({ message: 'Αποτυχία διαγραφής προϊόντος', error: error.message });
  }
});


// Get single product by ID
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;  // Λαμβάνουμε το ID από το URL
  try {
    const product = await Product.findById(id);  // Βρίσκουμε το προϊόν με το ID
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);  // Στέλνουμε το προϊόν πίσω στον πελάτη
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});
// Ενημέρωση προϊόντος
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    // Έλεγχος εγκυρότητας του ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Μη έγκυρο format ID προϊόντος' });
    }

    // Έλεγχος αν το προϊόν υπάρχει
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Το προϊόν δεν βρέθηκε' });
    }

    // Ενημέρωση των πεδίων του προϊόντος
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    if (image) product.image = image;

    // Αποθήκευση αλλαγών
    await product.save();
    res.status(200).json({ message: 'Το προϊόν ενημερώθηκε επιτυχώς', product });
  } catch (error) {
    res.status(500).json({ message: 'Αποτυχία ενημέρωσης προϊόντος', error: error.message });
  }
});
