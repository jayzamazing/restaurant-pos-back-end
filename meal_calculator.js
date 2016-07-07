/*jshint esversion: 6 */
var fs = require('fs');
//declaration
var someRestaurant;
//get the restaurant data from the json file and log results or reject reason
promiseLogging(
        getRestaurantData()
    )
    //get the results
    .then(result => {
        //initialize restaurant and set to have 5 tables
        someRestaurant = new Restaurant(5);
        promiseAllLogging([
            //take the json data and store in restaurant class
            someRestaurant.addMenuItems(result['menu items']),
            someRestaurant.addStateTax(result['state tax']),
            someRestaurant.addTip(result['recommended tip']),
            //add dinners to a specific table
            someRestaurant.addDinnersToTable(2, 3),
            //add order to a dinner at a specific table
            someRestaurant.addGuestOrder(2, 1, ['burger', 'fries', 'soft drink']),
            //TODO

        ]);
    })
    .then(function() {promiseLogging(someRestaurant.printTableChecks(2));}
  );
/*
* Function that represents generic store object
*/
function Store() {
    this.state_tax = 0;
    this.tip = 0;
}
/*
 * Function to set state tax
 * @param items - state tax
 * @return resolve - taxes
 */
Store.prototype.addStateTax = function(item) {
    //set as promise
    return new Promise(function(resolve, reject) {
            //set objects tax
            this.state_tax = parseFloat(item) / 100;
            //return state tax
            resolve(this.state_tax);
    });
};
/*
 * Function to set tip
 * @param item - tip
 * @return resolve - tip
 */
Store.prototype.addTip = function(item) {
    //set as promise
    return new Promise(function(resolve) {
            //set this object tip
            this.tip = parseFloat(item) / 100;
            //send back tip
            resolve(this.tip);
    });
};
/*
* Function that represents restaurant object
* @param tablenumbers - amount of tables the restaurant has
*/
function Restaurant(tableNumbers) {
    //store amount of tables restaurant has
    this.tableNumbers = tableNumbers;
    //declare and initialize tables object, has a relationship
    this.floorTables = new Tables();
    this.menu_items = {};
    //set floortables to have a certain amount of tables
    this.floorTables.createTables();
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
            dinner.addDishes(item);
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
    //set as object
    return new Promise(function(resolve) {
        //set menu
        this.menu_items = items;
        //return menu
        resolve(this.menu_items);
    });
};
/*
 * Function to get specific menu items from the restaurants menu
 * @param items - array of items
 * @return filtered map of menu items
 */
Restaurant.prototype.getMenuItems = function(items) {
    //return map of the remaining items
    return items.map(function(item) {
        //find specific item
        return this.menu_items.find(function(menu_item) {
            //if item matches, then return object
            if (menu_item.description === item) {
                return menu_item;
            }
        });
    });
};
/*
* Function to represent tables object
*/
function Tables() {
    this.tables = new Map();
}
/*
* Function to add a certain amount of tables the restaurant
*/
Tables.prototype.createTables = function() {
    for (var i = 1; i <= this.tableNumbers; i++) {
        this.tables.set('table' + i, new Map());
    }
};
/*
* Function to represent a generic dinner
*/
function Dinner() {
    this.dishes = [];
}
/*
* Function to add dishes to a dinner
* @param items - dishes to add
*/
Dinner.prototype.addDishes = function(items) {
    this.dishes = this.dishes.concat(items);
};
/*
 * Function to get the restaurant data from the json file
 * @return resolve/reject - either json data or rejection reason
 */
function getRestaurantData() {
    //return promise so this can be used in a promise chain
    return new Promise(function(resolve, reject) {
        //read the json file
        fs.readFile('dinnerdata.json', 'utf8', function(err, data) {
            //if there is any error exit, sending error back to the promise
            if (err) {
                reject(err);
                //otherwise take the data, parse it, and send it back to the promise
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}
/*
* Function to deal with chain of promises and their logging
* @param callbacks- functions to perform
* @return resolve/reject - either data or rejection reason
*/
function promiseAllLogging(callbacks) {
    return new Promise(function(resolve, reject) {
        Promise.all(callbacks).then(result => {
                console.log(result);
                resolve(result);
            })
            //if there are any errors, log them here
            .catch(error => {
                console.log(error);
                reject('Stopped working');
            });
    });
}
/*
 * Helper function to deal with result and error logging
 * @param callback - array of functions to perform
 * @return resolve/reject - either data or rejection reason
 */
function promiseLogging(callback) {
    return new Promise(function(resolve, reject) {
        //function to do the following on
        callback
        //after performing method, log results
            .then(result => {
                console.log(result);
                resolve(result);
            })
            //if there are any errors, log them here
            .catch(error => {
                console.log(error);
                reject('Stopped working');
            });
    });
}
