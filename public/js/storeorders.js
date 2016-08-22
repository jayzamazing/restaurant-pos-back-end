'use strict';
var storeOrders = angular.module('storeOrders', []);
storeOrders.controller('OrderData', ['$scope', '$location', 'dataStore',
function ($scope, $location, dataStore) {
  console.log(dataStore.get());
}]);
