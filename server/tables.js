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
var exports = module.exports = Tables;
