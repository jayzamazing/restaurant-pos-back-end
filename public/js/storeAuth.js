'use strict';
var angular = require('angular');
var storeAuth = angular.module('storeAuth', []);
// storeAuth.controller('AuthUser', ['$scope', '$location', //'clientAuth',
// function ($scope, $location//, clientAuth
// ) {
//   //function to call login in serverauth
//   $scope.login = function() {
//     $scope.sub = true;
//     var postData = {
//       'username' : $scope.username,
//       'storenumber' : $scope.storeNumber,
//       'password' : $scope.password
//     };
//     clientAuth.auth({}, postData,
//     function success(res) {
//       if (res.userAuth === 'auth') {
//         // storeToken(res.token, new Date());
//         console.log('wuz up');
//         $location.path('');//TODO decide on path
//       } else {
//         $scope.error = 'Login Failed';
//       }
//       postData = null;
//     },
//   function error(err) {
//     console.error('Error: ' + JSON.stringify(err));
//   });
//   };
// }]);
