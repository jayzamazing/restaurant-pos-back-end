'use strict';
var storeTable = angular.module('storeTable', []);
storeTable.controller('TableData', ['$scope', '$location', 'getTable',
function ($scope, $location, getTable) {
  //function to call login in serverAuth
  $scope.table = function(table) {
    var postData = {
      tableId: table.currentTarget.getAttribute('data-id')
    };
    getTable(postData)
    .then(function(res) {
    console.log(res);
    //if there is an error
    }).catch(function(err) {
      console.log(err);
      //TODO add error page
    });
  };
}]);
