'use strict';
var storeTable = angular.module('storeTable', []);
storeTable.controller('TableData', ['$scope', '$location', '$route', 'Table', 'DataStore',
function ($scope, $location, $route, Table, DataStore) {
  //function to call login in serverAuth
  $scope.table = function(table) {
    //setup query
    var postData = {
      query: {
        tableId: parseInt(table.currentTarget.getAttribute('data-id'))
      }
    };
    //get tables checks
    Table.get(postData)
    //then with the result
    .then(function(res) {
    //add the table id to res object
    res.tableId = parseInt(table.currentTarget.getAttribute('data-id'));
    //add results to store in service
    DataStore.set(res);
    //call /orders to have routeprovider load new page
    $location.path('/orders');
    $route.reload();
    }).catch(function(err) {
      console.log(err);
      //TODO add error page
    });
  };
}]);
