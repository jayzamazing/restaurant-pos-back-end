/*jshint esversion: 6 */
(function() {
  "use strict";
    //import mongoose
    var mongoose = require('mongoose');
    //set the schema for this collection
    var MenuSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        price: {
            type: Number,
            required: true
        },
        categories: [{
            type: String,
            required: true
        }]
    });
    //create collection variable based on schema
    var Menu = mongoose.model('menu', MenuSchema);
    /*
     * @param name - string name
     * @param price - double price
     * @param categories - array of category
     * @resolve/reject - success showing item / error
     */
    Menu.createItem = function(name, price, categories) {
        //return promise so this can be used in a promise chain
        return new Promise(function(resolve, reject) {
            //object to fill for query
            var menuItem = {
                name: name,
                price: price,
                categories: categories
            };
            //mongoose create to add item to mongo
            Menu.create(menuItem, function(err, result) {
                //if there is an error or store is empty
                if (err || !result) {
                    //send back error
                    reject('Could not create menu item: ' + name);
                }
                //otherwise send back success
                resolve(result);
            });
        });
    };
    /*
     * Function to updata a menu item
     * @param item - item to search for
     * @param name - name of menu item
     * @param price - price of menu item
     * @param categories - array of categories
     * @resolve/reject - updated item /error
     */
    Menu.updateItem = function(item, name, price, categories) {
        //return promise so this can be used in a promise chain
        return new Promise(function(resolve, reject) {
            var menuItem = {
                name: name,
                price: price,
                categories: categories
            };
            //mongoose findandupdate to update item in mongo
            Menu.findOneAndUpdate({
                name: item
            }, menuItem, {
                new: true
            }, function(err, result) {
                //if there is an error or result is empty
                if (err || !result) {
                    //send back error
                    reject('Could not update menu item');
                }
                //otherwise send back success
                resolve(result);
            });
        });
    };
    /*
     * Function to delete item from mongodb
     * @param name - name of item to delete
     * @resolve/reject - message item was deleted / error
     */
    Menu.deleteItem = function(name) {
        //return promise so this can be used in a promise chain
        return new Promise(function(resolve, reject) {
            Menu.findOneAndRemove({
                name: name
            }, function(err, result) {
                //if there is an error or result is empty
                if (err || !result) {
                    //send back error
                    reject('Could not delete item: ' + name);
                }
                //otherwise send back success
                resolve(result);
            });
        });
    };
    /*
     * Function to retrieve the entire menu
     * @resolve/reject - entire menu / error
     */
    Menu.getMenu = function() {
        //return promise so this can be used in a promise chain
        return new Promise(function(resolve, reject) {
            //get the menu
            Menu.find(function(err, result) {
                //if there is an error or store is empty
                if (err || !result) {
                    //send back error
                    reject('Could not get the menu');
                }
                //otherwise send back success
                resolve(result);
            });
        });
    };
    module.exports = Menu;
})();
