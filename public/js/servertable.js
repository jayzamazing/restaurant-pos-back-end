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

var tables = app.service('tables');

//factory singleton object dealing with getting a table
serverTable.factory('getTable',
function() {
  var table = function(id) {
  
    return null;//TODO
  };
  return table;
});
