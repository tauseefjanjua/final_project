const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({
                "username": username,
                "password": password
            });
            return res.status(200).json({
                message: "User successfully registered. Now you can login"
            })
        } else {
            return res.status(404).json({
                message: "User already exist"
            })
        }
    }
    return res.status(404).json({
        message: "Unable to register user"
    })
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  res.send(await JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
    const ISBN = await req.params.isbn;
    res.send(ISBN);
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
    const auth = await req.params.author;
    const KEYS = await Object.keys(books);
    let filtered = await [];
    KEYS.forEach((each) => {
      if(books[each].author === auth) {
        filtered.push(books[each]);
      }
    });
    res.send(filtered);
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
    const title = await req.params.title;
    const KEYS = await Object.keys(books);
    let filtered = await [];
    KEYS.forEach((each) => {
      if(books[parseInt(each)].title === title) {
        filtered.push(books[parseInt(each)]);
      }
    });
    res.send(filtered);
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const ISBN = await req.params.isbn;
  res.send(books[ISBN].reviews);
});

module.exports.general = public_users;
