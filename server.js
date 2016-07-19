/*jshint esversion: 6 */
(function() {
    "use strict";
    //import express
    var express = require('express');
    var restaurantController = express();
    //temporary usage of fs to get json data
    //var fs = require('fs');
    var mongoose = require('mongoose');
    //to deal with json parsing
    var bodyParser = require('body-parser');
    var jsonParser = bodyParser.json();
    //import local files
    var Restaurant = require('./server/restaurant.js');
    var ph = require('./server/promisehelpers.js');
    var config = require('./server/config.js');
    var Store = require('./server/models/store.js');
    var Menu = require('./server/models/menu.js');
    //initialize restaurant and set to have 5 tables
    var restaurantModel = new Restaurant(5);
    //set folder for static content
    restaurantController.use('static', express.static('public'));
    //use bodyparser for all routes
    restaurantController.use(bodyParser.json());
    /*
     * Function to set the first page to load and also set the initial state of the application
     * @return - sends the index.html file back
     */
    restaurantController.get('/', function(req, res) {
        //if the following fields are empty, ensure this is only run once
        if (restaurantModel.menu_items.length === 0 && restaurantModel.store_name === '') {
            //get the restaurant data mongo and log results or reject reason
            ph.promiseAllLogging([
                Store.getStore('FOod r Us1'),
                Menu.getMenu()
            ]).then(function(results) {
                //pass results to restaurant model, results[0] = store data, results[1] = menu data
                ph.promiseLogging(
                    restaurantModel.setRestaurantData(results[0], results[1])
                ).then(function() {
                    //send index page back to requestor
                    res.sendFile(__dirname + '/public/index.html');
                });
            }).catch(function(err) {
                console.log(err);
            });
        }

    });
    /*
     * Function to get the store information
     * @return - res with 201 and store / res with 500 error
     */
    restaurantController.get('/store', function(req, res) {
        //get the store data from mongo and log results or reject reason
        ph.promiseLogging(restaurantModel.getStore())
            //if succesful then return 201 with the store data
            .then(function(item) {
                res.status(201).json(item);
                //if there was an error, return 500
            }).catch(function() {
                res.status(500);
            });
    });
    /*
     * Function to create a store in mongo
     * @param req.body.store_name - name of store
     * @param req.body.address - address of the store
     * @param req.body.state - state the store resides in
     * @param req.body.zip_code - zip code of the store
     * @param req.body.tax - state tax
     * @param req.body.recommended_tip - recommended tip
     * is to become this restaurants information
     * @return - res with 201 and store / res with 500 error
     */
    restaurantController.post('/store', function(req, res) {
        //create store data in mongo and log results or reject reason
        ph.promiseLogging(Store.createStore(req.body.store_name, req.body.address, req.body.city, req.body.state,
                req.body.zip_code, req.body.tax, req.body.recommended_tip))
            //if succesful then return 201 with the store data
            .then(function(item) {
                res.status(201).json(item);
                //if there was an error, return 500
            }).catch(function() {
                res.status(500);
            });
    });
    /*
     * Function to update a store
     * @param req.body.name1 - original name of store
     * @param req.body.name2 - name to change to, if store name is changed
     * @param req.body.address - address of the store
     * @param req.body.state - state the store resides in
     * @param req.body.zip - zip code of the store
     * @param req.body.tax - state tax
     * @param req.body.tip - recommended tip
     * @param req.body.main_store - true/false depending on if the set store information
     * is to become this restaurants information
     * @return - res with 201 and store / res with 500 error
     */
    restaurantController.put('/store', function(req, res) {
        //create store data in mongo and log results or reject reason
        //ph.promiseLogging(store.updateStore('FOod r Us3', 'FOod r Us9', '313 blah', 'here', 'fl', '33412', '9', '20'))
        ph.promiseLogging(Store.updateStore(
                req.body.name1, req.body.name2, req.body.address, req.body.city,
                req.body.state, req.body.zip, req.body.tax, req.body.tip))
            //if succesful then return 201 with the store data
            .then(function(item) {
                res.status(201).json(item);
                //if there was an error, return 500
            }).catch(function() {
                res.status(500);
            });
    });
    /*
     * Function to delete a store
     * @param req.body.name - name of the store
     * @return - res with 201 and store / res with 500 error
     */
    restaurantController.delete('/store', function(req, res) {
        //delete menu item in mongo and log results or reject reason
        //ph.promiseLogging(store.deleteStore('FOod r Us3'))
        ph.promiseLogging(Store.deleteStore(req.body.name))
            //if succesful then return 201 with the store data
            .then(function(item) {
                res.status(201).json(item);
                //if there was an error, return 500
            }).catch(function() {
                res.status(500);
            });
    });
    /*
     * Function to create a menu item
     * @param req.body.itemname - name of menu item
     * @param req.body.price - price of item
     * @param req.body.categories - array of categories
     * @return - res with 201 and menu item / res with 500 error
     */
    restaurantController.post('/menuitem', function(req, res) {
        //create menu item in mongo and log results or reject reason
        ph.promiseLogging(Menu.createItem(req.body.itemname, req.body.price, req.body.categories))
            //if succesful then return 201 with the menu item data
            .then(function(item) {
                res.status(201).json(item);
                //if there was an error, return 500
            }).catch(function() {
                res.status(500);
            });
    });
    /*
     * Function to update a menu item
     * @param req.body.itemname1 - original name of menu item
     * @param req.body.itemname2 - name of menu item after change
     * @param req.body.price - price of item
     * @param req.body.categories - array of categories
     * @return - res with 201 and menu item / res with 500 error
     */
    restaurantController.put('/menuitem', function(req, res) {
        //update menu item in mongo and log results or reject reason
        ph.promiseLogging(Menu.updateItem(
                req.body.itemname1, req.body.itemname2, req.body.price, req.body.categories))
            //if succesful then return 201 with the menu item data
            .then(function(item) {
                res.status(201).json(item);
                //if there was an error, return 500
            }).catch(function() {
                res.status(500);
            });
    });
    /*
     * Function to delete a menu item
     * @param req.body.itemname - name of menu item
     * @return - res with 201 and menu item / res with 500 error
     */
    restaurantController.delete('/menuitem', function(req, res) {
        //delete menu item in mongo and log results or reject reason
        ph.promiseLogging(Menu.deleteItem(req.body.itemname))
            //if succesful then return 201 with the menu item data
            .then(function(item) {
                res.status(201).json(item);
                //if there was an error, return 500
            }).catch(function() {
                res.status(500);
            });
    });
    /*
     * Function to get the entire menu
     * @return - res with 201 and menu / res with 500 error
     */
    restaurantController.get('/menu', function(req, res) {
        //get entire menu from mongo and log results or reject reason
        ph.promiseLogging(Menu.getMenu())
            //if succesful then return 201 with the menu data
            .then(function(item) {
                res.status(201).json(item);
                //if there was an error, return 500
            }).catch(function() {
                res.status(500);
            });
    });
    /*
     * Function to deal with setting the seperate check count
     * @param req.body.table_number - table number to add seperate checks to
     * @param req.body.guest - amount of guests
     */
    restaurantController.post('/guest', function(req, res) {
        //if there is no body in the request
        if (!req.body) {
            //return error code 400
            res.sendStatus(400);
        }
        //add seperate checks to specific table
        ph.promiseLogging(restaurantModel.addDinnersToTable(req.body.table_number, req.body.guest))
            //if succesful then return 201
            .then(function(item) {
                res.status(201).json({
                    dinners: item.get('table' + req.body.table_number).length
                });
                //if there was an error, return 500
            }).catch(function() {
                res.status(500);
            });
    });
    /*
     * Function to add order to table for a specific check
     * @param req.body.table_number - table number to add the order to
     * @param req.dinner_number - dinner or guest number
     * @param req.body.order - the meals for a specific guest
     * @return - status 200/400
     */
    restaurantController.post('/order', function(req, res) {
        //if there is no body in the request
        if (!req.body) {
            //return error code 400
            res.sendStatus(400);
        }
        ph.promiseLogging([
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
    /*
     * Function to get mongoose connection started and node running
     */
    function runServer(callback) {
        //connect to database using what is stored in config file
        mongoose.connect(config.DATABASE_URL, function(err) {
            //if there is any kind of error
            if (err && callback) {
                //pass the error to the callback
                return callback(err);
            }
            //start listening on specified port for requests
            restaurantController.listen(config.PORT, function() {
                console.log('Listening on localhost:' + config.PORT);
                //perform callback
                if (callback) {
                    callback();
                }
            });
        });
    }
    //turn into executable and module, if is run directly, otherwise server can be started differently
    if (require.main === module) {
        //run this function
        runServer(function(err) {
            //if there are any errors, pass to console
            if (err) {
                console.error(err);
            }
        });
    }

    //export for testing
    exports.app = restaurantController;
    exports.storage = restaurantModel;
    exports.runServer = runServer;
})();
