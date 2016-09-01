'use strict';
var storeCheckout = angular.module('storeCheckout', []);
storeCheckout.controller('Checkout', ['$scope', '$location', '$route', 'DataStore', 'Tables', 'Stores',
  function($scope, $location, $route, DataStore, Tables, Stores) {
    $scope.cashStatus = true;
    $scope.fullyPaid = false;
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
    $scope.checkStatus = 'unpaid';
    //set table number
    $scope.tableNumber = tableChecks.tableId;
    //total up all the ticket items
    $scope.total = tableChecks.order.reduce((prev, current) => {
        return {cost: prev.cost + current.cost};
    }).cost;
    $scope.recommendedTotal = ($scope.total + ($scope.total * (storeInfo.recommendedTip / 100))).toFixed(2);
    //function that returns to showing the categories
    $scope.categorySelect = function() {
      //call /orders to have routeprovider load new page
      $location.path('/orders');
      $route.reload();
    };
    //function to add number to cash out amount
    $scope.numberClick = function(number) {
      if ($scope.cashAmount) {
        $scope.cashAmount = (parseFloat('0' + $scope.cashAmount + number));
      } else {
        $scope.cashAmount = (parseFloat('0' + number));
      }
    };
    //function to add a decimal to the back of the cash amount
    $scope.addDecimal = function() {
      //turn cashamount into a string
      var temp = $scope.cashAmount.toString();
      //ensure that there is only one . in the string
      if ( temp && !temp.includes('.')) {
        $scope.cashAmount = $scope.cashAmount + '.';
      }
    };
    //function to enable clicking on number buttons to enter cash amount
    $scope.cash = function() {
      $scope.cashStatus = false;
    };
    //function to show amount paid and remove check
    $scope.calculate = function() {
      //if the amount paid is equal or greater than the amount owed
      if ($scope.cashAmount >= $scope.total) {
        //display paid and change on the screen
        $scope.paid = $scope.cashAmount;
        $scope.change = ($scope.cashAmount - $scope.total).toFixed(2);
        //disable buttons
        $scope.cashStatus = true;
        Tables.remove(tableChecks._id)
        .then((res) => {
          //change status on check to paid
          $scope.checkStatus = 'paid';
          $scope.fullyPaid = true;
          //force update to occur in view
          $scope.$apply();
        });
      }

    };
  }]);
