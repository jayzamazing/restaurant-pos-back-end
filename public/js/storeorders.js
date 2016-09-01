'use strict';
var storeOrders = angular.module('storeOrders', []);
storeOrders.controller('OrderData', ['$scope', '$location', '$route', 'DataStore', 'Categories',
  'Menus', 'Tables',
  function($scope, $location, $route, DataStore, Categories, Menus, Tables) {
    //variable that tells whether it is in menu categories or menu items
    var menu = true;
    $scope.deleteStatus = true;
    $scope.menu = menu;
    var tableChecks = DataStore.get();
    //setup query
    var postData = {
      query: {
        tableId: parseInt(tableChecks.tableId),
        $sort: {
          'checkNumber': 1
        }
      }
    };
    //get amount of tables
    Tables.find(postData)
      //then with the result
      .then(function(res1) {
        if (res1.total > 0) {
          //get the first check for table
          tableChecks = res1.data[0];
          //store off each check number for later use
          tableChecks.checks = res1.data.map((item) => {
            return item.checkNumber;
          });
          tableChecks.count = res1.total;
          $scope.items = tableChecks.order;
          //set table number
          $scope.tableNumber = tableChecks.tableId;
          //set default guest number
          $scope.checkNumber = tableChecks.checkNumber;
          //show amount of checks
          $scope.count = tableChecks.count;
          DataStore.set(tableChecks);
          $scope.$apply();
          //otherwise
        } else {
          //create an empty check
          Tables.create({
              tableId: tableChecks.tableId,
              checkNumber: 1,
              order: []
            })
            .then((res) => {
              tableChecks = res;
              tableChecks.count = 1;
              tableChecks.checks[0] = 1;
              //initially show guest 1
              $scope.items = tableChecks.order;
              //set table number
              $scope.tableNumber = tableChecks.tableId;
              //set default guest number
              $scope.checkNumber = tableChecks.checkNumber;
              //show amount of checks
              $scope.count = tableChecks.count;
              DataStore.set(tableChecks);
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
      }).catch(function(err) {
        console.log(err);
        //TODO add error page
      });
    //set the selected item for later use
    $scope.select = function(item) {
      $scope.selected = item;
      $scope.deleteStatus = false;
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
        //hide categories button, show  menu button
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
        //hide table button, show categories button
        $scope.menu = menu;
        menu = true;
        //get the menu item based on button clicked
        Menus.get(item.currentTarget.getAttribute('data-id'))
          .then((res) => {
            //push the data into the documents array
            postData = {
              $push: {
                order: {
                  dish: res.name,
                  notes: '',
                  cost: res.price
                }
              }
            };
            //update the tables check
            Tables.update(DataStore.get()._id, postData)
              .then((res) => {
                var data = res;
                data.count = tableChecks.count;
                data.checks = tableChecks.checks;
                //add results to store in service
                DataStore.set(data);
                //set choices in scope
                $scope.items = data.order;
                //set table number
                $scope.tableNumber = data.tableId;
                //set default guest number
                $scope.checkNumber = data.checkNumber;
                //force update to occur in view
                $scope.$apply();

              });
          });
      }
    };
    //function that returns to showing the tables
    $scope.selectTable = function() {
      //call /orders to have routeprovider load new page
      $location.path('/tables');//TODO change so there is no reload
      $route.reload();
    };
    //function that returns to showing the categories
    $scope.categorySelect = function() {
      //call /orders to have routeprovider load new page
      $location.path('/orders');//TODO change so there is no reload
      $route.reload();
    };
    $scope.nextTable = function(item) {
      if (tableChecks.count > 1) {
        tableChecks = DataStore.get();
        var min = 1,
          max = tableChecks.count;
        var currentCheck = tableChecks.checkNumber;
        //if left arrow is clicked
        if (item.currentTarget.getAttribute('data-id') === 'left') {
          for (var i = tableChecks.count - 1; i >= 0; i--) {
            if(tableChecks.checks[i] === currentCheck) {
              if (i !== 0) {
                currentCheck = tableChecks.checks[i - 1];
                break;
              } else {
                currentCheck = tableChecks.checks[tableChecks.count - 1];
                break;
              }
            }
          }
          //otherwise right arrow is clicked
        } else {
          for (var j = 0; j < tableChecks.count; j++) {
            if(tableChecks.checks[j] === currentCheck) {
              if (j !== tableChecks.count - 1) {
                currentCheck = tableChecks.checks[j + 1];
                break;
              } else {
                currentCheck = tableChecks.checks[0];
                break;
              }
            }
          }
        }
        var postData = {
          query: {
            tableId: parseInt(tableChecks.tableId),
            checkNumber: currentCheck
          }
        };
        //get tables next check
        Tables.find(postData)
          //then with the result
          .then(function(res) {
            var data = res.data[0];
            data.count = tableChecks.count;
            data.checks = tableChecks.checks;
            //add results to store in service
            DataStore.set(data);
            //set choices in scope
            $scope.items = data.order;
            //set table number
            $scope.tableNumber = data.tableId;
            //set default guest number
            $scope.checkNumber = data.checkNumber;
            //force update to occur in view
            $scope.$apply();
          });
      }
    };
    //function to delete item from a check
    $scope.deleteItem = function() {
      //disable the button
      $scope.deleteStatus = false;
      var postData = {
        $pull: {
          order: {
            _id: $scope.selected._id
          }
        }
      };
      //update the tables check
      Tables.update(DataStore.get()._id, postData)
        .then((res) => {
          var data = res;
          data.count = tableChecks.count;
          data.checks = tableChecks.checks;
          //add results to store in service
          DataStore.set(data);
          //set choices in scope
          $scope.items = data.order;
          //set table number
          $scope.tableNumber = data.tableId;
          //set default guest number
          $scope.checkNumber = data.checkNumber;
          //force update to occur in view
          $scope.$apply();
        });
    };
    $scope.addCheck = function() {
      tableChecks.count++;
      //create an empty check
      Tables.create({
          tableId: $scope.tableNumber,
          checkNumber: tableChecks.checks[tableChecks.checks.length - 1] + 1,
          order: []
        })
        .then((res) => {
          var data = res;
          tableChecks.checks.push(res.checkNumber);
          data.checks = tableChecks.checks;
          data.count = tableChecks.count;
          //show amount of checks
          $scope.count = tableChecks.count;
          //add results to store in service
          DataStore.set(data);
          //set choices in scope
          $scope.items = data.order;
          //set table number
          $scope.tableNumber = data.tableId;
          //set default guest number
          $scope.checkNumber = data.checkNumber;
          //force update to occur in view
          $scope.$apply();
        });
    };
    //delete check for removal of empty checks
    $scope.deleteCheck = function() {
      tableChecks = DataStore.get();
      //if table has more than one check and current guest does not have associated orders
      if (tableChecks.count > 0 && $scope.items.length === 0) {
        $scope.count--;
        tableChecks.checks.splice(tableChecks.checks.indexOf(tableChecks.checkNumber), 1);
        //remove the table from the database
        Tables.remove(DataStore.get()._id)
          .then(() => {
            //decrement table checks count
            tableChecks.count--;
            //return to the first check for the table
            if (tableChecks.count >= 1) {
              var postData = {
                query: {
                  tableId: parseInt(tableChecks.tableId),
                  checkNumber: 1
                }
              };
              //get tables next check
              Tables.find(postData)
                //then with the result
                .then(function(res) {
                  var data = res.data[0];
                  data.count = tableChecks.count;
                  data.checks = tableChecks.checks;
                  //add results to store in service
                  DataStore.set(data);
                  //set choices in scope
                  $scope.items = data.order;
                  //set table number
                  $scope.tableNumber = data.tableId;
                  //set default guest number
                  $scope.checkNumber = data.checkNumber;
                  //force update to occur in view
                  $scope.$apply();
                });
              //otherwise if there are no other checks for table
            } else {
              //empty all fields
              $scope.items = '';
              $scope.checkNumber = 1;
              $scope.count = 0;
            }
          });
      }
    };
    $scope.checkout = function() {
      //call /checkout to have routeprovider load new page
      $location.path('/checkout');
      $route.reload();
    };
  }
]);
