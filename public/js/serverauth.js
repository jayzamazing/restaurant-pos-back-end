'use strict';
var serverAuth = angular.module('serverAuth', []);
//set up feathers client side
let app = feathers()
.configure(hooks())
.configure(authentication({
  storage: window.localStorage
}))

serverAuth.factory('clientAuth',
function() {
  return app.authenticate({
    type: 'local'
  }, {}, {
    auth: {method: 'POST, cache: false, isArray: false'}
  });
});
serverAuth.factory('storeToken', );
