'use strict';
//get dependencies
import io from 'socket.io-client';
import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client';
import localstorage from 'feathers-localstorage';
import authentication from 'feathers-authentication/client';
var serverTable = angular.module('serverTable', []);
//set address and port
const socket = io('http://localhost:3030/');
//set up feathers client side
let app = feathers()
.configure(socketio(socket))
.configure(hooks())
.configure(authentication({
  storage: window.localStorage
}));
//factory singleton object dealing with getting a table
serverTable.factory('getTable',
function() {
  //function to get specific table with guests
  var table = function(postData) {
    //authenticate using stored token
    app.authenticate();
    //return function for caller to use
    return app.service('tables').find(postData);
  };
  return table;
});
//factory singleton object for storage of data between controllers
serverTable.factory('dataStore', function() {
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
  }
});
