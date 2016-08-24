'use strict';
var storeOrders = angular.module('storeOrders', []);
storeOrders.controller('OrderData', ['$scope', '$location', 'DataStore', 'Categories',
'Menus',
function ($scope, $location, DataStore, Categories, Menus) {
  //variable that tells whether it is in menu categories or menu items
  var menu = true;

  //initially show guest 1
  $scope.items = DataStore.get().data[0].order;
  //set table number
  $scope.tableNumber = DataStore.get().tableId;
  //set default guest number
  $scope.checkNumber = 1;
  //get the categories
  Categories.get()
  .then(function(res) {
    //set choices in scope
    $scope.choices = res.data;
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
  //deal with click events on the menu
  $scope.menuItems = function(item) {
    if (menu) {
      var postData = {
        categories: {
          categories: item
        }
      };
      Menus.get(postData)
      .then(function(res){
        //set choices in scope
        $scope.choices = res.data;
      });
    }
  };
}]);
