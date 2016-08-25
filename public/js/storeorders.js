'use strict';
var storeOrders = angular.module('storeOrders', []);
storeOrders.controller('OrderData', ['$scope', '$location', '$route', 'DataStore', 'Categories',
'Menus',
function ($scope, $location, $route, DataStore, Categories, Menus) {
  //variable that tells whether it is in menu categories or menu items
  var menu = true;
  $scope.menu = menu;
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
    //only run if looking at categories, not specific menu items
    if (menu) {
      menu = false;
      $scope.menu = menu;
      //create query for specific categories
      var postData = {
        query: {
          categories: item.currentTarget.getAttribute('data-id')
        }
      };
      //send request for menu items matching category
      Menus.get(postData)
      .then((res) => {
        //set choices in scope
        $scope.choices = res.data;
        //force update to occur in view
        $scope.$apply();
      });
    } else {
      //shows notes input
      $scope.menu = menu;
      menu = true;
    }
  };
  //function that returns to showing the tables
  $scope.selectTable = function() {
    //call /orders to have routeprovider load new page
    $location.path('/tables');
    $route.reload();
  };
  //function that returns to showing the categories
  $scope.categorySelect = function() {
    //call /orders to have routeprovider load new page
    $location.path('/orders');
    $route.reload();
  };
}]);
