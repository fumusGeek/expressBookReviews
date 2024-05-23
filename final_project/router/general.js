const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (username && password) {
        if (!isValid(username)) {
            users.push({ 'username': username, 'password': password });
            if (users) {
                return res.status(200).json({ message: "Registration succeed" });
            } else {
                return res.status(404).json({ message: "Registration failed." })
            }
        } else {
            return res.status(404).json({ message: "User already registered!" });
        }
    }
    return res.status(404).json({ message: "Please fill correctly" });
});

// Add promises
let myPromise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Get all books resolved')
    }, 5000)
})

let myPromise2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Get books based on ISBN resolved')
    }, 5000)
})

let myPromise3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Get books based on Author resolved');
    }, 5000);
});

let myPromise4 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Get books based on Title resolved');
    }, 5000);
});

myPromise1.then(() => {
    // Set up a route to handle requests for fetching book data
    public_users.get('/', function (req, res) {
        return res.status(200).send(JSON.stringify(books, null, 4));
    });
});

myPromise2.then(() => {
    // Get book details based on ISBN
    public_users.get('/isbn/:isbn', function (req, res) {
        const isbn = req.params.isbn;
        res.status(300).send(books[isbn]);
    });
})

myPromise3.then(() => {
    // Get book details based on author
    public_users.get('/author/:author', function (req, res) {
        const author = req.params.author;
        res.status(300).send(iterateBooks(books, 'author', author));

    });
})

myPromise4.then(() => {
    // Get all books based on title
    public_users.get('/title/:title', function (req, res) {
        const title = req.params.title;
        res.status(300).send(iterateBooks(books, 'title', title));
    });
})

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.status(300).send(books[isbn].reviews);
});

function iterateBooks(obj, propName, propValue) {
    let datas = [];
    Object.keys(obj).forEach(key => {
        const data = obj[key];
        if (data[propName] === propValue) {
            datas.push(data);
        }
    });
    return datas;
}

module.exports.general = public_users;
