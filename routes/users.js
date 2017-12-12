'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const {User} = require('../models/users');
const Router = express.Router();
Router.use(bodyParser.json());

Router.post('/', (req, res) => {
  if (!req.body) {
    res.status(400).json({message: 'No request body'});
  }
  if (!('username' in req.body)) {
    res.status(422).json({message: 'Missing field: username'});
  }
  let {username, password, store} = req.body;
  if (typeof username !== 'string') {
    res.status(422).json({message: 'Invalid field type: username'});
  }
  username = username.trim();
  if (username === '') {
    res.status(422).json({message: 'Incorrect field length: username'});
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
  store
});
})
.then(user => {
  res.setHeader('Content-Type', 'application/json');
  res.status(201).json(user.apiRepr());
})
.catch(err => {
  if (err.reason === 'ValidationError') {
    return res.status(err.code).json(err);
  }
  res.status(500).json({message: err});
});
});

module.exports = {Router};
