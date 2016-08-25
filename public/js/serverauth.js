'use strict';
//get dependencies
import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import rest from 'feathers-rest/client';
import localstorage from 'feathers-localstorage';
import authentication from 'feathers-authentication/client';
var host, app;
//set module
var serverAuth = angular.module('serverAuth', []);
//factory singleton object dealing with authenticating user
serverAuth.factory('clientAuth',
function($location) {
  var setup = function() {
    //set address and port
    host = $location.$$protocol + '://' + $location.$$host + ':' + $location.port();
    console.log(host);
    //set up feathers client side
    app = feathers()
    .configure(rest(host).fetch(window.fetch.bind(window)))
    .configure(hooks())
    .configure(authentication({
      storage: window.localStorage
    }));
  };
  var auth = function(postData) {
    postData.type = 'local';
    return app.authenticate(postData);
  };
  var getApp = function() {
    return app;
  };
  return {
    setup: setup,
    auth: auth,
    get: getApp
  };

});
