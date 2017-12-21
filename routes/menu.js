'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const {Menu} = require('../models/menu');
const {authenticatedJWT} = require('../middlewares/authcheck');

const Router = express.Router();
Router.use(bodyParser.json());

Router.post('/', authenticatedJWT, (req, res) => {
  if (!req.body) {
    return res.status(400).json({message: 'No request body'});
  }
  if (!('name' in req.body)) {
    return res.status(422).json({message: 'Missing field: name'});
  }
  if (!('price' in req.body)) {
    return res.status(422).json({message: 'Missing field: price'});
  }
  if (!('category' in req.body)) {
    return res.status(422).json({message: 'Missing field: category'});
  }
  let {name, price, category} = req.body;
  if (typeof name !== 'string') {
    return res.status(422).json({message: 'Invalid field type: name'});
  }
  if (typeof price !== 'number') {
    return res.status(422).json({message: 'Invalid field type: price'});
  }
  if (typeof category !== 'string') {
    return res.status(422).json({message: 'Invalid field type: category'});
  }
  name = name.trim();
  if (name === '') {
    return res.status(422).json({message: 'Incorrect field length: name'});
  }
  category = category.trim();
  if (category === '') {
    return res.status(422).json({message: 'Incorrect field length: category'});
  }
  //check for existing menu
  Menu
  .find({name})
  .count()
  .exec()
  .then(count => {
    if (count > 0) {
      return Promise.reject({
        code: 422,
        reason: 'ValidationError',
        message: 'Menu already taken',
        location: 'menu'
      });
    }
  })
  .then(() => {
    return Menu
    .create({name, price, category});
  })
  .then(menu => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json(menu.apiRepr());
  })
  .catch(err => {
    if (err.reason === 'ValidationError') {
      return res.status(err.code).json(err);
    }
    res.status(500).json({message: err});
  });
});
Router.get('/', authenticatedJWT, (req, res) => {
  Menu.find()
  .exec()
  .then(menu => {
    var count = menu.length;
    if (count >= 1) {
      res.setHeader('Content-Type', 'application/json');
      res.json(
        menu.map(
          (menu) => menu.apiRepr()
        )
      );
    } else {
      return Promise.reject({
        code: 204,
        reason: 'NoData',
        message: 'No Data found under menu'
      });
    }
  })
  .catch(err => {
    if (err.reason === 'NoData') {
      return res.status(err.code).json(err);
    }
    return res.status(500).json({message: err});
  });
});

module.exports = {Router};
