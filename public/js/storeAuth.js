'use strict';

var storeAuth = angular.module('storeAuth', []);
storeAuth.controller('AuthUser', ['$scope', '$location', 'clientAuth', 'storeToken',
function (sc, loc, clientAuth, storeToken) {
  //function to call login in serverauth
  sc.login = function() {
    sc.sub = true;
    var postData = {
      'username' : sc.username,
      'storenumber' : sc.storeNumber,
      'password' : sc.password
    };
    clientAuth.auth({}, postData,
    function success(res) {
      if (res.userAuth === 'auth') {
        storeToken(res.token, new Date());
        loc.path('');//TODO decide on path
      } else {
        sc.error = 'Login Failed';
      }
      postData = null;
    },
  function error(err) {
    console.error('Error: ' + JSON.stringify(err));
  });
  };
}]);
