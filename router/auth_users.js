const { json } = require('express');
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let sameName = users.filter((user) => {
    return user.username === username
  });
  if (sameName.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let authenticUsers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (authenticUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({
            message: "Error Loggin In"
        })
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 24 * 60 * 60 });

        req.session.authorization = { accessToken, username }
        return res.status(200).send("User successfully Logged In");
    } else {
        return res.status(208).json({
            message: "Invalid Login. Confirm, username and passowrd are correct"
        })
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const ISBN = req.params.isbn;
  const Auth = req.session.authorization;
  let Review = books[ISBN].reviews;
  if(books[ISBN].reviews[Auth.username] === Auth.username) {
    books[ISBN].reviews[Auth.username] = req.body.review;
  } else {
    books[ISBN].reviews[Auth.username] = Auth.username;
    books[ISBN].reviews[Auth.username] = req.body.review;
  }
  res.send(JSON.stringify(books[ISBN].reviews));
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const ISBN = req.params.isbn;
  const Auth = req.session.authorization;
  let Review = books[ISBN].reviews;
  if(books[ISBN].reviews[Auth.username] === Auth.username) {
   delete books[ISBN].reviews[Auth.username];
  } 
  res.send("Your Review has been deleted");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
