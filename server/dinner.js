/*jshint esversion: 6 */
(function() {
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
var exports = module.exports = Dinner;
})();
