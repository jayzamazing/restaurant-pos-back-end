'use strict';
var storeTable = angular.module('storeTable', []);
storeTable.controller('TableData', ['$scope', '$location', '$route', 'Table', 'DataStore',
function ($scope, $location, $route, Table, DataStore) {
  //function to call login in serverAuth
  $scope.table = function(table) {
    var postData = {
      query: {
        tableId: parseInt(table.currentTarget.getAttribute('data-id'))
      }
    };
    Table.get(postData)
    .then(function(res) {
    res.tableId = parseInt(table.currentTarget.getAttribute('data-id'));
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
