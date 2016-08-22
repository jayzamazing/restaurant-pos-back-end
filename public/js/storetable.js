'use strict';
var storeTable = angular.module('storeTable', []);
storeTable.controller('TableData', ['$scope', '$location', '$route', 'getTable', 'dataStore',
function ($scope, $location, $route, getTable, dataStore) {
  //function to call login in serverAuth
  $scope.table = function(table) {
    var postData = {
      query: {
        tableId: parseInt(table.currentTarget.getAttribute('data-id'))
      }
    };
    getTable(postData)
    .then(function(res) {
    res.tableId = parseInt(table.currentTarget.getAttribute('data-id'));
    dataStore.set(res);
    //call /orders to have routeprovider load new page
    $location.path('/orders');
    $route.reload();
    }).catch(function(err) {
      console.log(err);
      //TODO add error page
    });
  };
}]);
