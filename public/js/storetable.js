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
        checkNumber: 1
      }
    };
    //get tables first check
    Tables.find(postData)
    //then with the result
    .then(function(res) {
    var data = res.data;
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
