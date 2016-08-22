'use strict';
var storeOrders = angular.module('storeOrders', []);
storeOrders.controller('OrderData', ['$scope', '$location', '$routeParams',
function ($scope, $location, $routeParams) {
  console.log($routeParams.tabledata);
}]);
