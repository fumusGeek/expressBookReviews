const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let userwithsamename = users.filter((user) => {
        return user.username === username
    })
    if (userwithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    })
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging you in, please try again." });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 })

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({ message: "Successfully login!" })
    } else {
        return res.status(404).json({ message: "Invalid login. Please re-check your input" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    let book = books[isbn];
    const review = req.query.review;
    if (!book) {
        return res.status(404).json({ message: "Book that you reviewed doesn't exist." })
    }
    if (!review) {
        return res.status(404).json({ message: "Fill review." })

    }
    if(book.reviews && book.reviews[username])
    {
        book.reviews[username] = review;
    } else {
        book.reviews = { ...book.reviews, [username]: review};
    }
    return res.status(200).send(book);
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const username = req.session.authorization.username;
    if(!username)
    {
        return res.status(404).json({message: 'Please login first'});
    }
    if(!book)
    {
        return res.status(404).json({message: "Book that you delete doesn't exist."})
    }
    if(book.reviews && book.reviews[username])
    {
        delete book.reviews[username];
        return res.status(200).send(`Review with username ${username} deleted`)
    } else {
        return res.status(404).send(`No review found for username ${username}`);
    }

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
