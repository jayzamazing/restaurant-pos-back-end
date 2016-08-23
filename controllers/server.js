/*jshint esversion: 6 */
(function() {
    "use strict";
    //import express
    var express = require('express');
    var app = express();
    var mongoose = require('mongoose');
    var passport = require('passport');
    var path = require('path');
    var BasicStrategy = require('passport-http').BasicStrategy;
    //to deal with json parsing
    var bodyParser = require('body-parser');
    //import local files
    var Restaurant = require('../models/restaurant.js');
    var ph = require('../lib/promisehelpers.js');
    var config = require('../config/config.js');
    var Store = require('../models/store-model.js');
    var Menu = require('../models/menu-model.js');
    var User = require('../models/user-model.js');
    //initialize restaurant and set to have 5 tables
    var restaurantModel = new Restaurant(5);
    //set folder for static content
    app.use('/static', express.static('../build'));
    app.use('/scripts', express.static(__dirname + '/node_modules/'));
    //use bodyparser for all routes
    app.use(bodyParser.json());
    app.use(passport.initialize());
    /*
    * Set up the strategy to authenticate users against
    * @resolve/reject - user data / error
    */
    var strategy = new BasicStrategy(function(username, password, callback) {
      User.findOne({username: username}, function(err, user) {
        if(err) {
          callback('Invalid username');
        }
        user.validatePassword(password, function(err, isValid){
          if(err || !result) {
            callback('Invalid password');
          }
        });
        callback(null, user);
      });

    });
    passport.use(strategy);
    /*
     * Function to set the first page to load and also set the initial state of the application
     * @return - sends the index.html file back
     */
    app.get('/', function(req, res) {
        //if the following fields are empty, ensure this is only run once
        if (restaurantModel.menu_items.length === 0 && restaurantModel.store_name === '') {
            //get the restaurant data mongo and log results or reject reason
            (async function(){
              try {
                var results = await ph.promiseAllLogging([
                    Store.getStore('FOod r Us1'),
                    Menu.getMenu()
                ]);
                await ph.promiseLogging(
                    restaurantModel.setRestaurantData(results[0], results[1])
                );
                //send index page back to requestor
                res.sendFile(path.resolve('build/index.html'));
              } catch (error) {
                console.error(error);
                res.sendStatus(500);
              }
            }());
            // ph.promiseAllLogging([
            //     Store.getStore('FOod r Us1'),
            //     Menu.getMenu()
            // ]).then(function(results) {
            //     //pass results to restaurant model, results[0] = store data, results[1] = menu data
            //     ph.promiseLogging(
            //         restaurantModel.setRestaurantData(results[0], results[1])
            //     ).then(function() {
            //         //send index page back to requestor
            //         res.sendFile(path.resolve('build/index.html'));
            //     });
            // }).catch(function() {
            //     res.sendStatus(500);
            // });
        }
    });
    /*
     * Function to get the store information
     * @return - res with 201 and store / res with 500 error
     */
    app.get('/store', passport.authenticate('basic', {session: false}), function(req, res) {
        (async function() {
          try {
            var item = await ph.promiseLogging(restaurantModel.getStore());
            res.status(201).json(item);
          } catch (err) {
            res.sendStatus(500);
          }
        }());
        //get the store data from mongo and log results or reject reason
        // ph.promiseLogging(restaurantModel.getStore())
        //     //if succesful then return 201 with the store data
        //     .then(function(item) {
        //         res.status(201).json(item);
        //         //if there was an error, return 500
        //     }).catch(function() {
        //         res.sendStatus(500);
        //     });
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
    app.post('/store', function(req, res) {
      (async function() {
        try {
          var result = await ph.promiseLogging(Store.createStore(req.body.store_name, req.body.address, req.body.city, req.body.state,
                  req.body.zip_code, req.body.tax, req.body.recommended_tip));
          res.status(201).json(result);
        } catch (err) {
          res.sendStatus(500);
        }
      }());
        // //create store data in mongo and log results or reject reason
        // ph.promiseLogging(Store.createStore(req.body.store_name, req.body.address, req.body.city, req.body.state,
        //         req.body.zip_code, req.body.tax, req.body.recommended_tip))
        //     //if succesful then return 201 with the store data
        //     .then(function(item) {
        //         res.status(201).json(item);
        //         //if there was an error, return 500
        //     }).catch(function() {
        //         res.sendStatus(500);
        //     });
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
    app.put('/store', function(req, res) {
      (async function() {
        try {
          var result = await ph.promiseLogging(Store.updateStore(
                  req.body.name1, req.body.name2, req.body.address, req.body.city,
                  req.body.state, req.body.zip, req.body.tax, req.body.tip));
          res.status(201).json(result);
        } catch (err) {
          res.sendStatus(500);
        }
      }());
        //create store data in mongo and log results or reject reason
        //ph.promiseLogging(store.updateStore('FOod r Us3', 'FOod r Us9', '313 blah', 'here', 'fl', '33412', '9', '20'))
        // ph.promiseLogging(Store.updateStore(
        //         req.body.name1, req.body.name2, req.body.address, req.body.city,
        //         req.body.state, req.body.zip, req.body.tax, req.body.tip))
        //     //if succesful then return 201 with the store data
        //     .then(function(item) {
        //         res.status(201).json(item);
        //         //if there was an error, return 500
        //     }).catch(function() {
        //         res.sendStatus(500);
        //     });
    });
    /*
     * Function to delete a store
     * @param req.body.name - name of the store
     * @return - res with 201 and store / res with 500 error
     */
    app.delete('/store', function(req, res) {
      (async function() {
        try {
          var result = await ph.promiseLogging(Store.deleteStore(req.body.name));
          res.status(201).json(result);
        } catch (err) {
          res.sendStatus(500);
        }
      }());
        //delete menu item in mongo and log results or reject reason
        //ph.promiseLogging(store.deleteStore('FOod r Us3'))
        // ph.promiseLogging(Store.deleteStore(req.body.name))
        //     //if succesful then return 201 with the store data
        //     .then(function(item) {
        //         res.status(201).json(item);
        //         //if there was an error, return 500
        //     }).catch(function() {
        //         res.sendStatus(500);
        //     });
    });
    /*
     * Function to create a menu item
     * @param req.body.itemname - name of menu item
     * @param req.body.price - price of item
     * @param req.body.categories - array of categories
     * @return - res with 201 and menu item / res with 500 error
     */
    app.post('/menuitem', function(req, res) {
      (async function() {
        try {
          var result = await ph.promiseLogging(Menu.createItem(req.body.itemname, req.body.price, req.body.categories));
          res.status(201).json(result);
        } catch (err) {
          res.sendStatus(500);
        }
      }());
        //create menu item in mongo and log results or reject reason
        // ph.promiseLogging(Menu.createItem(req.body.itemname, req.body.price, req.body.categories))
        //     //if succesful then return 201 with the menu item data
        //     .then(function(item) {
        //         res.status(201).json(item);
        //         //if there was an error, return 500
        //     }).catch(function() {
        //         res.sendStatus(500);
        //     });
    });
    /*
     * Function to update a menu item
     * @param req.body.itemname1 - original name of menu item
     * @param req.body.itemname2 - name of menu item after change
     * @param req.body.price - price of item
     * @param req.body.categories - array of categories
     * @return - res with 201 and menu item / res with 500 error
     */
    app.put('/menuitem', function(req, res) {
      (async function() {
        try {
          var result = await ph.promiseLogging(Menu.updateItem(
                  req.body.itemname1, req.body.itemname2, req.body.price, req.body.categories));
          res.status(201).json(result);
        } catch (err) {
          res.sendStatus(500);
        }
      }());
        //update menu item in mongo and log results or reject reason
        // ph.promiseLogging(Menu.updateItem(
        //         req.body.itemname1, req.body.itemname2, req.body.price, req.body.categories))
        //     //if succesful then return 201 with the menu item data
        //     .then(function(item) {
        //         res.status(201).json(item);
        //         //if there was an error, return 500
        //     }).catch(function() {
        //         res.sendStatus(500);
        //     });
    });
    /*
     * Function to delete a menu item
     * @param req.body.itemname - name of menu item
     * @return - res with 201 and menu item / res with 500 error
     */
    app.delete('/menuitem', function(req, res) {
      (async function() {
        try {
          var result = await ph.promiseLogging(Menu.deleteItem(req.body.itemname));
          res.status(201).json(result);
        } catch (err) {
          res.sendStatus(500);
        }
      }());
        //delete menu item in mongo and log results or reject reason
        // ph.promiseLogging(Menu.deleteItem(req.body.itemname))
        //     //if succesful then return 201 with the menu item data
        //     .then(function(item) {
        //         res.status(201).json(item);
        //         //if there was an error, return 500
        //     }).catch(function() {
        //         res.sendStatus(500);
        //     });
    });
    /*
     * Function to get the entire menu
     * @return - res with 201 and menu / res with 500 error
     */
    app.get('/menu', function(req, res) {
      (async function() {
        try {
          var result = await ph.promiseLogging(Menu.getMenu());
          res.status(201).json(result);
        } catch (err) {
          res.sendStatus(500);
        }
      }());
        //get entire menu from mongo and log results or reject reason
        // ph.promiseLogging(Menu.getMenu())
        //     //if succesful then return 201 with the menu data
        //     .then(function(item) {
        //         res.status(201).json(item);
        //         //if there was an error, return 500
        //     }).catch(function() {
        //         res.sendStatus(500);
        //     });
    });
    /*
     * Function to deal with setting the seperate check count
     * @param req.body.table_number - table number to add seperate checks to
     * @param req.body.guest - amount of guests
     */
    app.post('/guest', function(req, res) {
      //if there is no body in the request
      if (!req.body) {
          //return error code 400
          res.sendStatus(400);
      }
      (async function() {
        try {
          var result = await ph.promiseLogging(restaurantModel.addDinnersToTable(req.body.table_number, req.body.guest));
          res.status(201).json({
              dinners: result.get('table' + req.body.table_number).size
          });
        } catch (err) {
          res.sendStatus(500);
        }
      }());
        //add seperate checks to specific table
        // ph.promiseLogging(restaurantModel.addDinnersToTable(req.body.table_number, req.body.guest))
        //     //if succesful then return 201
        //     .then(function(item) {
        //         res.status(201).json({
        //             dinners: item.get('table' + req.body.table_number).size
        //         });
        //         //if there was an error, return 500
        //     }).catch(function() {
        //         res.sendStatus(500);
        //     });
    });
    /*
     * Function to add order to table for a specific check
     * @param req.body.table_number - table number to add the order to
     * @param req.dinner_number - dinner or guest number
     * @param req.body.order - the meals for a specific guest
     * @return - status 200/400
     */
    app.post('/order', function(req, res) {
        //if there is no body in the request
        if (!req.body) {
            //return error code 400
            res.sendStatus(400);
        }
        (async function() {
          try {
            await ph.promiseLogging(
                    //add order to tables dinner
                    restaurantModel
                    .addGuestOrder(req.body.table_number,
                        req.body.dinner_number,
                        req.body.order)
                );
            res.sendStatus(200);
          } catch (err) {
            res.sendStatus(400);
          }
        }());
        // ph.promiseLogging(
        //         //add order to tables dinner
        //         restaurantModel
        //         .addGuestOrder(req.body.table_number,
        //             req.body.dinner_number,
        //             req.body.order)
        //     )
        //     //if there are no error return 200 status
        //     .then(function() {
        //         res.sendStatus(200);
        //     })
        //     //otherwise return 400 status
        //     .catch(function() {
        //         res.sendStatus(400);
        //     });
    });
    /*
     * Function that deals with adding users for authentication
     * @param req.body.username - user name
     * @param req.body.password - password for the user
     * @response - 201 success
     */
    app.post('/users', function(req, res) {
        //initialize and declare user model
        var user = new User({
            username: req.body.username,
            password: req.body.password
        });
        (async function() {
          try {
            var result = await ph.promiseLogging(user.saveCredentials());
            res.sendStatus(201);
          } catch (err) {
            res.sendStatus(400);
          }
        }());
        //save credentials to mongodb
        // ph.promiseLogging(user.saveCredentials())
        // .then(function() {
        //   //return sucess message
        //   res.sendStatus(201);
        // })
        // //otherwise return 400 status
        // .catch(function() {
        //     res.sendStatus(400);
        // });
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
            app.listen(config.PORT, function() {
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
    exports.app = app;
    exports.storage = restaurantModel;
    exports.runServer = runServer;
})();
