'use strict';
var app;
var storeInfo = angular.module('storeInfo', []);

//factory singleton object dealing with getting a stores
storeInfo.factory('Stores',
function(clientAuth) {
    var storeInfo = {};
    //authenticate using stored token
    // app.authenticate();
  //function to find specific table with guests using query
  function find(postData) {
    app = clientAuth.get();
    //return function for caller to use, gets table based on query passed in
    return app.service('stores').find(postData);
  }
  //get the stores info
  function get() {
    return storeInfo;
  }
  //set the stores info
  function set(data) {
    storeInfo = data;
  }
  return {
    find: find,
    get: get,
    set: set
  };
});
