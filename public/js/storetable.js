'use strict';
var storeTable = angular.module('storeTable', []);
storeTable.controller('TableData', ['$scope', '$location', '$route', 'Tables', 'DataStore',
function ($scope, $location, $route, Tables, DataStore) {
  //function to call login in serverAuth
  $scope.table = function(table) {
    var data = {};
    //add the table id and checknumber to data object
    data.tableId = parseInt(table.currentTarget.getAttribute('data-id'));
    //store in service
    DataStore.set(data);
    //call /orders to have routeprovider load new page
    $location.path('/orders');
    $route.reload();
  };
}]);
