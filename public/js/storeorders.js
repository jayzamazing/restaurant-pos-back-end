'use strict';
var storeOrders = angular.module('storeOrders', []);
storeOrders.controller('OrderData', ['$scope', '$location', '$route', 'DataStore', 'Categories',
'Menus', 'Tables',
function ($scope, $location, $route, DataStore, Categories, Menus, Tables) {
  //variable that tells whether it is in menu categories or menu items
  var menu = true;
  $scope.menu = menu;
  //set table number
  $scope.tableNumber = DataStore.get().tableId;
  //set default guest number
  $scope.checkNumber = 1;
  var temp1 = DataStore.get();
  //if table has a check
  if (temp1) {
    //initially show guest 1
    $scope.items = DataStore.get().data[0].order;
  //otherwise
  } else {
    var orders = $scope.items;
    Tables.create({
      tableId: $scope.tableNumber,
      checkNumber: $scope.checkNumber,
      order: []
    })
    .then((res) => {
      DataStore.set(res);
      //set choices in scope
      $scope.items = res.data;
      //force update to occur in view
      $scope.$apply();
    });
  }
  //get the categories
  Categories.find()
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
          categories: item.currentTarget.innerHTML
        }
      };
      //send request for menu items matching category
      Menus.find(postData)
      .then((res) => {
        //set choices in scope
        $scope.choices = res.data;
        //force update to occur in view
        $scope.$apply();
      });
    } else {
      $scope.menu = menu;
      menu = true;
        Menus.get(item.currentTarget.getAttribute('data-id'))
        .then((res) => {
          var orders = $scope.items;
          //if there is an existing order
          if (orders) {
            //add to the end of the ticket
            orders.push({
              dish: res.name,
              notes: '',
              cost: res.price
            });
          } else {
            orders = [{
              dish: res.name,
              notes: '',
              cost: res.price
            }];
          }
          postData = {
            tableId: $scope.tableNumber,
            checkNumber: $scope.checkNumber,
            order: orders
          };
          var temp = DataStore.get();
          Tables.update(DataStore.get().data[0]._id, postData)
          .then((res) => {
            //set choices in scope
            $scope.items = res.order;
            //force update to occur in view
            $scope.$apply();
          });
        });

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
