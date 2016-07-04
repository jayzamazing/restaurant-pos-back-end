/*jshint esversion: 6 */
var fs = require('fs');

promiseLogging(getRestaurantData());

function getRestaurantData() {
    //return promise so this can be used in a promise chain
    return new Promise(function(resolve, reject) {
        fs.readFile('dinnerdata.json', 'utf8', function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
    });
}
/*
 * Helper function to deal with result and error logging
 */
function promiseLogging(callback) {
    //return promise so this can be used in a promise chain
    return new Promise(function(resolve, reject) {
        //function to do the following on
        callback
        //after performing method, log results
            .then(function(result) {
                console.log(result);
            })
            //if there are any errors, log them here
            .catch(function(error) {
                console.log(error);
                //exit with error
                reject('Stopped working');
            });
        //send fullfil message
        resolve('Working so far');
    });
}
