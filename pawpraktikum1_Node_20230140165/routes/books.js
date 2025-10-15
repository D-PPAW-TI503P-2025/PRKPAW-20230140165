const express = require('express');
const router = express.Router();

// Array ini berfungsi sebagai database sementara untuk menyimpan data buku
let books = [
  {id: 1, title: 'Book 1', author: 'Author 1'},
  {id: 2, title: 'Book 2', author: 'Author 2'}
];

// READ all books
router.get('/', (req, res) => {
  res.json(books);
});

// READ a single book by ID
router.get('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');
  res.json(book);
});

// CREATE a new book
router.post('/', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }
  const book = {
    id: books.length + 1,
    title,
    author
  };
  books.push(book);
  res.status(201).json(book);
});

// UPDATE a book by ID
router.put('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');
  
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  book.title = title;
  book.author = author;
  res.json(book);
});

// DELETE a book by ID
router.delete('/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) return res.status(404).send('Book not found');

  const deletedBook = books.splice(bookIndex, 1);
  res.json(deletedBook[0]);
});

// Export router agar bisa digunakan di file server.js
module.exports = router;