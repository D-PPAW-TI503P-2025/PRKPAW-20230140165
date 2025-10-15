const express = require('express');
const cors = require('cors'); 
const app = express();
const PORT = 3001; 

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Middleware untuk logging setiap request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Panggil rute buku dari file books.js
const bookRoutes = require('./routes/books');

// Gunakan rute buku
app.use('/api/books', bookRoutes);

// Rute dasar
app.get('/', (req, res) => {
  res.send('Home Page for API');
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});