'use strict';
var storeCheckout = angular.module('storeCheckout', []);
storeCheckout.controller('Checkout', ['$scope', '$location', '$route', 'DataStore', 'Tables',
  function($scope, $location, $route, DataStore, Tables) {



    var tableChecks = DataStore.get();
    $scope.items = tableChecks.order;
    //set table number
    $scope.tableNumber = tableChecks.tableId;
  }]);
