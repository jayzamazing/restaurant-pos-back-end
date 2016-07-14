/*jshint esversion: 6 */
//Function object for exporting
function RestaurantLogging() {}
/*
 * Function to deal with chain of promises and their logging
 * @param callbacks- functions to perform as array
 * @return resolve/reject - either data or rejection reason
 */
RestaurantLogging.promiseAllLogging = function(callbacks) {
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
};
/*
 * Helper function to deal with result and error logging
 * @param callback - array of functions to perform
 * @return resolve/reject - either data or rejection reason
 */
RestaurantLogging.promiseLogging = function(callback) {
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
};
var exports = module.exports = RestaurantLogging;
