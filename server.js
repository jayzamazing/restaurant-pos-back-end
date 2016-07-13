/*jshint esversion: 6 */
//import express
var express = require('express');
var restaurantController = express();
//temporary usage of fs to get json data
var fs = require('fs');
var mongoose = require('mongoose');
//to deal with json parsing
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
//import local files
var Restaurant = require('./server/restaurant.js');
var ph = require('./server/promisehelpers.js');
var config = require('./server/config.js');
var Stores = require('./server/models/store.js');
var Menu = require('./server/models/menu.js');
//set folder for static content
restaurantController.use('static', express.static('public'));
restaurantController.use(bodyParser.json());
/*
 * Function to set the first page to load
 */
restaurantController.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
restaurantController.get('/store', function(req, res) {
    ph.promiseLogging(Stores.getStore('FOod r Us'))
        .then(function(item) {
            res.status(201).json(item);
        }).catch(function() {
            res.status(500);
        });
});
restaurantController.post('/store', function(req, res) {
    ph.promiseLogging(Stores.createStore('FOod r Us3', '313 somewhere', 'nowehere', 'fl', '33412', '6.5', '20'))
        .then(function(item) {
            res.status(201).json(item);
        }).catch(function() {
            res.status(500);
        });
});
restaurantController.post('/menuitem', function(req, res) {
    ph.promiseLogging(Menu.createItem('burger', '7.99', ['lunch', 'burgers', 'dinner']))
    .then(function(item) {
        res.status(201).json(item);
    }).catch(function() {
        res.status(500);
    });
});
restaurantController.get('/menu', function(req, res) {
  ph.promiseLogging(Menu.getMenu())
  .then(function(item) {
      res.status(201).json(item);
  }).catch(function() {
      res.status(500);
  });
});
//TODO stub placeholders
restaurantController.post('/order', function(req, res) {
    //if there is no body in the request
    if (!req.body) {
        //return error code 400
        return res.sendStatus(400);
    }
    ph.promiseAllLogging([
            //TODO remove later
            restaurantModel.addDinnersToTable(2, 3),
            //add order to tables dinner
            restaurantModel
            .addGuestOrder(req.body.table_number,
                req.body.dinner_number,
                req.body.order)
        ])
        //if there are no error return 200 status
        .then(function() {
            res.sendStatus(200);
        })
        //otherwise return 400 status
        .catch(function() {
            res.sendStatus(400);
        });
});

function runServer(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }
        //start listening on specified port for requests
        restaurantController.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
}
if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
}

//declaration and initialize restaurant and set to have 5 tables
//var restaurantModel = new Restaurant(5);
//get the restaurant data from the json file and log results or reject reason
//ph.promiseLogging(
//    restaurantModel.getRestaurantData()
//);
//export for testing
//exports.app = restaurantController;
//exports.storage = restaurantModel;
exports.runServer = runServer;
