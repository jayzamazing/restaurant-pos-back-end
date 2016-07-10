/*jshint esversion: 6 */
//import express
var express = require('express');
var app = express();
//temporary usage of fs to get json data
var fs = require('fs');
//to deal with json parsing
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
//import local files
var Restaurant = require('./js/restaurant.js');
var ph = require('./js/promisehelpers.js');
//declaration and initialize restaurant and set to have 5 tables
var restaurantController = new Restaurant(5);
//set folder for static content
app.use(express.static('public'));
/*
 * Function to set the first page to load
 */
app.get('/', function(req, res) {
    response.sendFile('/index.html');
});
//TODO stub placeholders
app.post('/order', jsonParser, function(req, res) {
    //if there is no body in the request
    if (!req.body) {
        //return error code 400
        return res.sendStatus(400);
    }
    ph.promiseAllLogging([
      //TODO remove later
      restaurantController.addDinnersToTable(2, 3),
      //add order to tables dinner
      restaurantController
        .addGuestOrder(req.body.table_number,
            req.body.dinner_number,
            req.body.order)
          ])
          //if there are no error return 200 status
          .then(function() {res.sendStatus(200);})
          //otherwise return 400 status`
          .catch(function() {res.sendStatus(400);});

});


//start listening on specified port for requests
app.listen(process.env.PORT || 8080);


//declaration and initialize restaurant and set to have 5 tables
var restaurantController = new Restaurant(5);
//get the restaurant data from the json file and log results or reject reason
ph.promiseLogging(
        restaurantController.getRestaurantData()
    )
    //get the results
    .then(result => {
        ph.promiseAllLogging([
            //take the json data and store in restaurant class
            restaurantController.addMenuItems(result['menu items']),
            restaurantController.addStateTax(result['state tax']),
            restaurantController.addTip(result['recommended tip']),
            //TODO remove in the future
            //add dinners to a specific table
            //restaurantController.addDinnersToTable(2, 3),
            //add order to a dinner at a specific table
            //restaurantController.addGuestOrder(2, 1, ['burger', 'fries', 'soft drink']),
        ]);
    })  //TODO remove in the future
    // .then(function() {
    //     ph.promiseLogging(restaurantController.printTableChecks(2));
    // })
    ;
//export for testing
exports.app = app;
exports.storage = restaurantController;
