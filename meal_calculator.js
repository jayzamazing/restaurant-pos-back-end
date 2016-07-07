/*jshint esversion: 6 */
var fs = require('fs');
var Restaurant = require('./js/restaurant.js');
var ph = require('./js/promisehelpers.js');
//declaration and initialize restaurant and set to have 5 tables
var someRestaurant = new Restaurant(5);
//get the restaurant data from the json file and log results or reject reason
ph.promiseLogging(
        someRestaurant.getRestaurantData()
    )
    //get the results
    .then(result => {
        ph.promiseAllLogging([
            //take the json data and store in restaurant class
            someRestaurant.addMenuItems(result['menu items']),
            someRestaurant.addStateTax(result['state tax']),
            someRestaurant.addTip(result['recommended tip']),
            //add dinners to a specific table
            someRestaurant.addDinnersToTable(2, 3),
            //add order to a dinner at a specific table
            someRestaurant.addGuestOrder(2, 1, ['burger', 'fries', 'soft drink']),
        ]);
    })
    .then(function() {
        ph.promiseLogging(someRestaurant.printTableChecks(2));
    });
