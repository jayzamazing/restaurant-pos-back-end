'use strict';
var app;
var serverTable = angular.module('serverTable', []);

//factory singleton object dealing with getting a table
serverTable.factory('Tables',
function(clientAuth) {
    app = clientAuth.get();
    //authenticate using stored token
    app.authenticate();
  //function to find specific table with guests using query
  function find(postData) {
    //return function for caller to use, gets table based on query passed in
    return app.service('tables').find(postData);
  }
  function create(postData) {
    return app.service('tables').create(postData);
  }
  function update(_id, postData) {
    return app.service('tables').update(_id, postData);
  }
  function remove(_id) {
    return app.service('tables').remove(_id);
  }
  return {
    find: find,
    create: create,
    update: update,
    remove: remove
  };
});
//factory singleton object dealing with categories
serverTable.factory('Categories',
function () {
  //get all categories
  function find() {
    //authenticate using stored token
    app.authenticate();
    return app.service('categories').find();
  }
  return {
    find: find
  };
});
//factory singleton object for storage of data between controllers
serverTable.factory('DataStore', function() {
  var storeData = {};
  //setter for this factory to store the data
  function set(data) {
    storeData = data;
  }
  //getter for this factory to return data
  function get() {
    return storeData;
  }
  return {
    set: set,
    get: get
  };
});
//factory singleton object that deals with menu
serverTable.factory('Menus', function() {
  function find(postData) {
    //query for data using postdata
    return app.service('menus').find(postData);
  }
  function get(_id) {
    return app.service('menus').get(_id);
  }
  return {
    find: find,
    get: get
  };
});
