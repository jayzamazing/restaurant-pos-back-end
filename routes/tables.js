'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const {Table} = require('../models/table');
const {Counter} = require('../models/counter');
const {authenticatedJWT} = require('../middlewares/authcheck');
const Router = express.Router();
Router.use(bodyParser.json());

Router.post('/', authenticatedJWT, (req, res) => {
  if (!req.body) {
    return res.status(400).json({message: 'No request body'});
  }
  if (!('tableId' in req.body)) {
    return res.status(422).json({message: 'Missing field: name'});
  }
  if (!('order' in req.body)) {
    return res.status(422).json({message: 'Missing field: price'});
  }
  if (!('dish' in req.body.order[0])) {
    return res.status(422).json({message: 'Missing field: category'});
  }
  if (!('notes' in req.body.order[0])) {
    return res.status(422).json({message: 'Missing field: category'});
  }
  const {tableId, order} = req.body;
  if (typeof tableId !== 'number') {
    return res.status(422).json({message: 'Invalid field type: tableId'});
  }
  if (!Array.isArray(order)) {
    return res.status(422).json({message: 'Invalid field type: order'});
  }
  let checkNumber = 0;
  Counter.findOne()
  .then(counter => {
    //if counter is not found
    if (counter === null || counter.checkDate() === true) {
      //create a counter
      return Counter.findOneAndUpdate({}, { checkNumber: 1 }, {upsert: true, new: true});
    } else {
      return Counter.findOneAndUpdate({}, { $inc: { checkNumber: 1 }}, {upsert: true, new: true});
    }
  })
  .then(counter => {
    checkNumber = counter.checkNumber;
    //create a table
    return Table
    .create({tableId, order, checkNumber});
  })
  .then(table => {
    //return table after
    return res.status(201).json(table.apiRepr());
  })
  .catch(err => {
    return res.status(500).json({message: err});
  });
});

module.exports = {Router};
