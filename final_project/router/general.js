const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
      return res.status(200).send(JSON.stringify(book, null, 2));
  } else {
      return res.status(404).json({ message: "Book not found" });
  }
});

  
// Get book details based on author
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author; // Extract author from request params
  let booksByAuthor = [];

  // Iterate through books object
  for (let key in books) {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
          booksByAuthor.push({ isbn: key, title: books[key].title });
      }
  }
  // Check if books were found
  if (booksByAuthor.length > 0) {
      return res.status(200).json({ books: booksByAuthor });
  } else {
      return res.status(404).json({ message: "No books found for this author" });
  }
});


// Get all books based on title
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title; // Extract title from request params
  let booksByTitle = [];

  // Iterate through books object
  for (let key in books) {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
          booksByTitle.push({ isbn: key, author: books[key].author });
      }
  }

  // Check if books were found
  if (booksByTitle.length > 0) {
      return res.status(200).json({ books: booksByTitle });
  } else {
      return res.status(404).json({ message: "No books found with this title" });
  }
});


//  Get book review
// Get book review
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn; // Extract ISBN from request params

  // Check if book exists
  if (books[isbn]) {
      return res.status(200).json({ reviews: books[isbn].reviews });
  } else {
      return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.general = public_users;
