const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const Users = require('../users/users-model');
const { JWT_SECRET } = require('../secrets');
const checkUserExists = require('../middleware/checkUserExists');
const checkUserNotTaken = require('../middleware/checkUserNotTaken');
const checkPayload = require('../middleware/checkPayload');

router.post('/register', checkPayload, checkUserNotTaken, (req, res, next) => {
  const { username, password } = req.body;  
  const hash = bcrypt.hashSync(req.body.password, 0)
    Users.create({ username, password: hash })
      .then(user => {
        res.status(201).json(user)
      })
      .catch(next)
});

router.post('/login', checkPayload, checkUserExists, (req, res, next) => {
    if(!bcrypt.compareSync(req.body.password, req.user.password)){
      next({ status: 400, message: 'invalid credentials' })
      return
    }
    const token = generateToken(req.user)
    res.status(200).json({
      message: `welcome, ${req.user.username}`,
      token
    })
});

const generateToken = user => {
  const payload = {
    subject: user.id,
    username: user.username
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' })
}

module.exports = router;

/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */



