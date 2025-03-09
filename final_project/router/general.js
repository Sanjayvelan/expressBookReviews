const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const axios = require('axios');
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body; // Extract username and password from request body

  // Check if both fields are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users.some(user => user.username === username)) {
      return res.status(409).json({ message: "Username already exists. Choose a different one." });
  }

  // Register the new user
  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered" });
});



// Get all books using Async-Await
public_users.get('/', async (req, res) => {
  try {
      // Simulating an external API call using a promise
      const response = await new Promise((resolve) => resolve({ data: books }));
      res.status(200).json({ message: "Implemented by Async-Await", data: response.data });
  } catch (error) {
      res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Get book details by ISBN using Async-Await
public_users.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
      if (books[isbn]) {
        res.status(200).json({ message: "Implemented by Async-Await", book: books[isbn] });
      } else {
          res.status(404).json({ message: "Book not found" });
      }
  } catch (error) {
      res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
  }
});

// Get books by author using Async-Await
public_users.get('/author/:author', async (req, res) => {
  const { author } = req.params;
  try {
      const booksByAuthor = Object.values(books).filter(book => book.author === author);
      if (booksByAuthor.length > 0) {
        res.status(200).json({ message: "Implemented by Async-Await", books: booksByAuthor });
      } else {
          res.status(404).json({ message: "No books found for this author" });
      }
  } catch (error) {
      res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Get books by title using Async-Await
public_users.get('/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
      const booksByTitle = Object.values(books).filter(book => book.title === title);
      if (booksByTitle.length > 0) {
        res.status(200).json({ message: "Implemented by Async-Await", books: booksByTitle });
      } else {
          res.status(404).json({ message: "No books found with this title" });
      }
  } catch (error) {
      res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

module.exports.general = public_users;