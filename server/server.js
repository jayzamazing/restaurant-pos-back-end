/*jshint esversion: 6 */
//import express
var express = require('express');
var restaurantController = express();
//temporary usage of fs to get json data
var fs = require('fs');
//to deal with json parsing
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
//import local files
var Restaurant = require('./restaurant.js');
var ph = require('./promisehelpers.js');
//set folder for static content
restaurantController.use(express.static('public'));
/*
 * Function to set the first page to load
 */
restaurantController.get('../', function(req, res) {
    response.sendFile('/index.html');
});
//TODO stub placeholders
restaurantController.post('/order', jsonParser, function(req, res) {
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
        //otherwise return 400 status`
        .catch(function() {
            res.sendStatus(400);
        });
});
//start listening on specified port for requests
restaurantController.listen(process.env.PORT || 8080);
//declaration and initialize restaurant and set to have 5 tables
var restaurantModel = new Restaurant(5);
//get the restaurant data from the json file and log results or reject reason
ph.promiseLogging(
    restaurantModel.getRestaurantData()
);
//export for testing
exports.app = restaurantController;
exports.storage = restaurantModel;
