const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
  "username": "testuser",
  "password": "mypassword"
  },
];

const isValid = (username) => { //returns boolean
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password) => { //returns boolean
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Validate user credentials
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create JWT token
    let accessToken = jwt.sign({ username }, "fingerprint_customer", { expiresIn: '1h' });

    // Save token in session
    req.session.authorization = { accessToken };

    return res.status(200).json({ message: "Login successful", token: accessToken });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;

  // Check if user is logged in
  if (!req.session.authorization) {
      return res.status(401).json({ message: "Unauthorized: Please log in first" });
  }

  const username = jwt.verify(req.session.authorization.accessToken, "fingerprint_customer").username;

  // Validate input
  if (!isbn || !review) {
      return res.status(400).json({ message: "ISBN and review are required" });
  }

  // Check if the book exists
  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  // Add or update the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;

  // Check if user is logged in
  if (!req.session.authorization) {
      return res.status(401).json({ message: "Unauthorized: Please log in first" });
  }

  const username = jwt.verify(req.session.authorization.accessToken, "fingerprint_customer").username;

  // Check if the book exists
  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has a review for this book
  if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found for this user" });
  }

  // Delete the review
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;



