'use strict';
var angular = require('angular');
import io from 'socket.io-client';
import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client';
import localstorage from 'feathers-localstorage';
import authentication from 'feathers-authentication/client';

var serverAuth = angular.module('serverAuth', []);
//set address and port
// const socket = io('http://localhost:3030/');
// //set up feathers client side
// let app = feathers()
// .configure(socketio(socket))
// .configure(hooks())
// .configure(authentication({
//   storage: window.localStorage
// }));

// serverAuth.factory('clientAuth',
// function() {
//   return app.authenticate({
//     type: 'local'
//   }, {}, {
//     auth: {method: 'POST, cache: false, isArray: false'}
//   });
// });