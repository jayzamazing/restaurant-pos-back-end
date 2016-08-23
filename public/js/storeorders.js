'use strict';
var storeOrders = angular.module('storeOrders', []);
storeOrders.controller('OrderData', ['$scope', '$location', 'DataStore', 'Categories',
function ($scope, $location, DataStore, Categories) {
  //initially show guest 1
  $scope.items = DataStore.get().data[0].order;
  //set table number
  $scope.tableNumber = DataStore.get().tableId;
  //set default guest number
  $scope.checkNumber = 1;
  //get the categories
  Categories.get()
  .then(function(res) {
    //set categories in scope
    $scope.categories = res.data;
    //force update to occur in view
    $scope.$apply();
  });
  //set the selected item for later use
  $scope.select = function(item) {
    $scope.selected = item;
  };
  //sets the highlight on the item
  $scope.isActive = function(item) {
    return $scope.selected === item;
  };
}]);
