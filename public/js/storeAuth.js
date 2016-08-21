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
    clientAuth(postData)
    //if successful
    .then(function(res) {
      //call /main to have routeprovider load new page
      $location.path('/tables');
    //if there is an error
    }).catch(function(err) {
      //TODO add error page
    });
  };
}]);
