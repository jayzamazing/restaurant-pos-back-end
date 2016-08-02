/*jshint esversion: 6 */
(function() {
    "use strict";
    var Store = require('./store.js');
    var Tables = require('./tables.js');
    var Dinner = require('./dinner.js');
    var ph = require('../lib/promisehelpers.js');
    var events = require('events');
    /*
     * Function that represents restaurant object
     * @param tablenumbers - amount of tables the restaurant has
     */
    function Restaurant(tableNumbers) {
        //call to super
        Store.call(this);
        //store amount of tables restaurant has
        this.tableNumbers = tableNumbers;
        //declare and initialize tables object, has a relationship
        this.floorTables = new Tables();
        this.menu_items = [];
        //set floortables to have a certain amount of tables
        this.floorTables.createTables(this.tableNumbers);
    }
    //Inherit variables and functions from store object, is a relationship
    Restaurant.prototype = Object.create(Store.prototype);
    Restaurant.prototype.constructor = Restaurant;
    /*
     * Function to add customers to a table
     * @param tablenumber - specific table number
     * @param customercount - amount of dinners at the table
     * @return resolve - tables data
     */
    Restaurant.prototype.addDinnersToTable = function(tableNumber, customerCount) {
        //store the current context
        var context = this;
        //set as a promise
        return new Promise(function(resolve) {
            //create a map to store dinners
            var temp = new Map();
            //loop over each and add dinners
            for (var i = 1; i <= customerCount; i++) {
                temp.set('Dinner #' + i, new Dinner());
            }
            //store updated table and dinner information in floortables
            context.floorTables.tables.set('table' + tableNumber, temp);
            //return tables
            resolve(context.floorTables.tables);
        });
    };
    /*
     * Function to add an order to a dinner at a specific table
     * @param tableNumber - table dinner is at
     * @param customerNumber - which check to add order to
     * @param customerOrder - items from menu to add to dinner
     * @return resolve - dishes added to dinner data
     */
    Restaurant.prototype.addGuestOrder = function(tableNumber, customerNumber, customerOrder) {
        //store current context
        var context = this;
        //set as promise
        return new Promise(function(resolve) {
            //get certain table numbers individual customer
            var table = context.floorTables.tables.get('table' + tableNumber);
            var dinner = table.get('Dinner #' + customerNumber);
            //get the menu item objects
            customerOrder = context.getMenuItems(customerOrder);
            //iterate and add customers order to customer
            customerOrder.forEach(function(item) {
                dinner.addDishes(item._doc);
            });
            //update table with dinner info
            table.set('Dinner #' + customerNumber, dinner);
            //update map with tables info
            context.floorTables.tables.set('table' + tableNumber, table);
            //return dishes added to dinner
            resolve(context.floorTables.tables.get('table' + tableNumber).get('Dinner #' + customerNumber).dishes);
        });
    };
    /*
     * Function to print out the tables checks
     * @para tableNumber - table number to print checks for
     * @return resolve - check for the table
     */
    Restaurant.prototype.printTableChecks = function(tableNumber) {
        //store current context
        var context = this;
        //set as promise
        return new Promise(function(resolve) {
            //get certain table numbers individual customer
            var table = context.floorTables.tables.get('table' + tableNumber);
            //set header for check
            var checks = 'Table #' + tableNumber + '\n';
            //iterate over each dinner
            table.forEach(function(item, index) {
                //if item is valid and dinner has dishes
                if (item && item.dishes.length) {
                    //append the dinner number
                    checks += index + '\n';
                    var total = 0;
                    //iterate over each dish
                    item.dishes.forEach(function(dish) {
                        //append dish
                        checks += dish.description + ' ' + dish.price + '\n';
                        //increment total
                        total += dish.price;
                    });
                    //calculate tax and tip
                    var tax = (total * this.state_tax).toFixed(2);
                    var tip = (total * this.tip).toFixed(2);
                    //append info to checks
                    checks += 'Sub Total $' + total + '\n';
                    checks += 'Sales Tax(' + (this.state_tax * 100) + '%)' + ' ' + tax + '\n';
                    checks += 'Tip(' + (this.tip * 100) + '%)' + ' ' + tip + '\n';
                    //calculate check total
                    total = parseFloat(tax) + parseFloat(tip) + parseFloat(total);
                    //append to checks
                    checks += 'Check Total $' + total + '\n';
                }
            });
            //return check output
            resolve(checks);
        });
    };
    /*
     * Function to set the menu items
     * @items - menu items
     * @return resolve- menu items
     */
    Restaurant.prototype.addMenuItems = function(items) {
        var context = this;
        //set as object
        return new Promise(function(resolve) {
            //set menu
            context.menu_items = items;
            //return menu
            resolve(context.menu_items);
        });
    };
    /*
     * Function to get specific menu items from the restaurants menu
     * @param items - array of items
     * @return filtered map of menu items
     */
    Restaurant.prototype.getMenuItems = function(items) {
        var context = this;
        //return map of the remaining items
        return items.map(function(item) {
            //find specific item
            return context.menu_items.find(function(menu_item) {
                //if item matches, then return object
                if (menu_item._doc.name === item) {
                    return menu_item;
                }
            });
        });
    };
    /*
     * Function to get the restaurant data from the json file
     * @params storeData - specific store
     * @params menuData - entire menu
     * @return resolve/reject - either json data or rejection reason
     */
    Restaurant.prototype.setRestaurantData = function(storeData, menuData) {
        var context = this;
        //return promise so this can be used in a promise chain
        return new Promise(function(resolve, reject) {
            //if either variables are empty
            if (!storeData && !menuData) {
                reject('Missing data');
                //otherwise take the data, parse it, and send it back to the promise
            } else {
                //take the json data and store in restaurant class
                menuData = getData(context.addMenuItems, menuData, context);
                storeData = getData(Store.prototype.setStore, storeData, context);
                // ph.promiseAllLogging([
                //     context.addMenuItems(menuData),
                //     Store.prototype.setStore.call(context, storeData)
                // ]);
                resolve({
                    storeData: storeData,
                    menuData: menuData
                });
            }
        });
    };

    function getData(func, data, context) {
          try {
            var temp;
            func.call(context, data);
            var retrieveData = function(data) {
              temp = data;
            }
            context.on('end', retrieveData);
            context.removeListener('end', retrieveData);
            return data;
          } catch (err) {
            throw err;
          }

    };
    module.exports = Restaurant;
})();
