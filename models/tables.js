/*jshint esversion: 6 */
(function() {
    /*
     * Function to represent tables object
     */
    function Tables() {
        this.tables = new Map();
    }
    /*
     * Function to add a certain amount of tables the restaurant
     */
    Tables.prototype.createTables = function(tableNumbers) {
        for (var i = 1; i <= tableNumbers; i++) {
            this.tables.set('table' + i, new Map());
        }
    };
    module.exports = Tables;
})();
