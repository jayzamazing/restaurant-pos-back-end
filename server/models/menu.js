var mongoose = require('mongoose');
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
var Menu = mongoose.model('menu', MenuSchema);
/*
 * @param name - string name
 * @param price - double price
 * @param categories - array of category
 */
Menu.createItem = function(name, price, categories) {
    return new Promise(function(resolve, reject) {
        var menuItem = {
            name: name,
            price: price,
            categories: categories
        };
        Menu.create(menuItem, function(err, result) {
            if (err || !result) {
                //send back error
                reject('Could not create menu item ' + name);
            }
            //otherwise send back success
            resolve('Created store ' + result);
        });
    });
};
Menu.getMenu = function() {
  return new Promise(function(resolve, reject) {
    Menu.find(function(err, result) {
      if (err || !result) {
          //send back error
          reject('Could not get the menu');
      }
      //otherwise send back success
      resolve('Menu Items: ' + result);
    });
  });
};

module.exports = Menu;
