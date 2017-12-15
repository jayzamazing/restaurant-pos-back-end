'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const {Categories} = require('../models/categories');
const {authenticatedJWT} = require('../middlewares/authcheck');

const Router = express.Router();
Router.use(bodyParser.json());

Router.post('/', authenticatedJWT, (req, res) => {
  if (!req.body) {
    res.status(400).json({message: 'No request body'});
  }
  if (!('name' in req.body)) {
    res.status(422).json({message: 'Missing field: name'});
  }
  let {name} = req.body;
  if (typeof name !== 'string') {
    res.status(422).json({message: 'Invalid field type: name'});
  }
  name = name.trim();
  if (name === '') {
    res.status(422).json({message: 'Incorrect field length: name'});
  }
// check for existing category
  Categories
.find({name})
.count()
.exec()
.then(count => {
  if (count > 0) {
    return Promise.reject({
      code: 422,
      reason: 'ValidationError',
      message: 'Category already taken',
      location: 'category'
    });
  }
})
.then(() => {
  return Categories
  .create({name});
})
.then(category => {
  res.setHeader('Content-Type', 'application/json');
  res.status(201).json(category.apiRepr());
})
.catch(err => {
  if (err.reason === 'ValidationError') {
    return res.status(err.code).json(err);
  }
  res.status(500).json({message: err});
});
});
Router.get('/', authenticatedJWT, (req, res) => {
  Categories
  .find()
  .exec()
  .then(categories => {
    var count = categories.length;
    if (count >= 1) {
      res.setHeader('Content-Type', 'application/json');
      res.json(
        categories.map(
          (categories) => categories.apiRepr()
        )
      );
    } else {
      return Promise.reject({
        code: 204,
        reason: 'NoData',
        message: 'No Data found under categories'
      });
    }
  })
  .catch(err => {
    if (err.reason === 'NoData') {
      return res.status(err.code).json(err);
    }
    res.status(500).json({message: err});
  });
});

module.exports = {Router};
