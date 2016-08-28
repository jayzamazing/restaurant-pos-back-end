'use strict';
var storeTable = angular.module('storeTable', []);
storeTable.controller('TableData', ['$scope', '$location', '$route', 'Tables', 'DataStore',
function ($scope, $location, $route, Tables, DataStore) {
  //function to call login in serverAuth
  $scope.table = function(table) {
    //setup query
    var postData = {
      query: {
        tableId: parseInt(table.currentTarget.getAttribute('data-id')),
      }
    };
    //get tables first check
    Tables.find(postData)
    //then with the result
    .then(function(res) {
      var count = 0, data;
      //get a count for the amount of check numbers at a table
      res.data.forEach(() => {
        count++;
      });
      //return the first check for table
      data = res.data.find((item) => {
        if (item.checkNumber === 1) {
          return item;
        }
      });
      //if data is undefined
      if (!data) {
        data = {};
      }
      data.count = count;
    //add the table id and checknumber to data object
    data.tableId = parseInt(table.currentTarget.getAttribute('data-id'));
    data.checkNumber = 1;
    //add results to store in service
    DataStore.set(data);
    //call /orders to have routeprovider load new page
    $location.path('/orders');
    $route.reload();
    }).catch(function(err) {
      console.log(err);
      //TODO add error page
    });
  };
}]);
