'use strict';
//set module and inject dependencies
var storeAuth = angular.module('storeAuth', []);
storeAuth.controller('AuthUser', ['$scope', '$location', '$route', 'clientAuth', 'Stores',
function ($scope, $location, $route, clientAuth, Stores) {
  clientAuth.setup();
  //function to call login in serverAuth
  $scope.login = function() {
    //variable to pass user credentials to server
    var postData = {
      username:  $scope.username,
      storenumber: $scope.storeNumber,
      password: $scope.password
    };
    //call to server side authetication passing in postdata credentials
    clientAuth.auth(postData)
    //if successful
    .then(function(res) {
      Stores.find({query: {
        storeNumber: $scope.storeNumber
      }}).then((res) => {
        //console.log(res.data[0]);
        Stores.set(res.data[0]);
        //call /tables to have routeprovider load new page
        $location.path('/tables');
        $route.reload();
      });
    //if there is an error
    }).catch(function(err) {
      //TODO add error page
    });
  };
}]);
