'use strict';
var storeCheckout = angular.module('storeCheckout', []);
storeCheckout.controller('Checkout', ['$scope', '$location', '$route', 'DataStore', 'Tables', 'Stores',
  function($scope, $location, $route, DataStore, Tables, Stores) {
    $scope.cashStatus = true;
    var tableChecks = DataStore.get();
    var storeInfo = Stores.get();
    $scope.storeName = storeInfo.storeName;
    $scope.address = storeInfo.address;
    $scope.city = storeInfo.city;
    $scope.state = storeInfo.state;
    $scope.zipCode = storeInfo.zipCode;
    $scope.items = tableChecks.order;
    $scope.tip = storeInfo.recommendedTip + '%';
    $scope.tax = storeInfo.stateTax + '%';
    //set table number
    $scope.tableNumber = tableChecks.tableId;
    //total up all the ticket items
    $scope.total = tableChecks.order.reduce((prev, current) => {
      return prev.cost + current.cost;
    });
    $scope.recommendedTotal = ($scope.total + ($scope.total * (storeInfo.recommendedTip / 100))).toFixed(2);
    //function that returns to showing the categories
    $scope.categorySelect = function() {
      //call /orders to have routeprovider load new page
      $location.path('/orders');
      $route.reload();
    };
    //function to add number to cash out amount
    $scope.numberClick = function(number) {

    };
    //function to enable clicking on number buttons to enter cash amount
    $scope.cash = function() {
      $scope.cashStatus = false;
    };
    $scope.calculate = function() {
      
    };
  }]);
