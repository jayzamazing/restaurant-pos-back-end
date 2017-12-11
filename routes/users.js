'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const {User} = require('../models/users');
const Router = express.Router();
const welcomeData = require('../helpers/welcomeData');
Router.use(bodyParser.json());

//check that the username is valid
function validateEmail(username) {
  const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(username);
}

Router.post('/', (req, res) => {
  if (!req.body) {
    res.status(400).json({message: 'No request body'});
  }
  if (!('username' in req.body)) {
    res.status(422).json({message: 'Missing field: username'});
  }
  let {username, password, fullName} = req.body;
  if (typeof username !== 'string') {
    res.status(422).json({message: 'Invalid field type: username'});
  }
  username = username.trim();
  if (username === '') {
    res.status(422).json({message: 'Incorrect field length: username'});
  }
  if (!validateEmail(username)) {
    res.status(422).json({message: 'Invalid field type: username'});
  }
  if (!password) {
    res.status(422).json({message: 'Missing field: password'});
  }
  if (typeof password !== 'string') {
    res.status(422).json({message: 'Incorrect field type: password'});
  }
  password = password.trim();

  if (password === '') {
    res.status(422).json({message: 'Incorrect field length: password'});
  }
// check for existing user
  User
.find({username})
.count()
.exec()
.then(count => {
  if (count > 0) {
    return Promise.reject({
      code: 422,
      reason: 'ValidationError',
      message: 'Username already taken',
      location: 'username'
    });
  }
// if no existing user, hash password
  return User.hashPassword(password);
})
.then(hash => {
  return User
.create({
  username,
  password: hash,
  fullName
});
})
.then(user => {
  const userInfo = user.apiRepr();
  //generate sample data for user
  welcomeData.createBoards(userInfo._id)
  .then(welcomeBoards => welcomeData.createCardslist(userInfo._id, welcomeBoards))
  .then(welcomeCardslist => welcomeData.createCards(userInfo._id, welcomeCardslist))
  .then(() => res.status(201).json(userInfo))
  .catch(err => {throw err});
})
.catch(err => {
  if (err.reason === 'ValidationError') {
    return res.status(err.code).json(err);
  }
  res.status(500).json({message: err});
});
});

module.exports = {Router};
