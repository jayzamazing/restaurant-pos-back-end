'use strict';
//set module and inject dependencies
var storeAuth = angular.module('storeAuth', []);
storeAuth.controller('AuthUser', ['$scope', '$location', 'clientAuth',
function ($scope, $location, clientAuth) {
  //function to call login in serverAuth
  $scope.login = function() {
    //variable to pass user credentials to server
    var postData = {
      username:  $scope.username,
      storenumber: $scope.storeNumber,
      password: $scope.password
    };
    //call to server side authetication passing in postdata credentials
    clientAuth(postData,
    //callback
    function success(res) {
      if (res.userAuth === 'auth') {
        // storeToken(res.token, new Date());
        console.log('wuz up');
        $location.path('');//TODO decide on path
      } else {
        $scope.error = 'Login Failed';
      }
      postData = null;
    },
  function error(err) {
    console.error('Error: ' + JSON.stringify(err));
  });
  };
}]);
