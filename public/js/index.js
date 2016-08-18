'use strict';
//set ngroute as dependency of app
var viewModel = angular.module('viewModel', ['ngRoute']);
//use routeprovider to create different routes in the application
viewModel.config(['$routeProvider', '$locationProvider',
  viewModel.config(function($routeProvider, $locationProvider) {
    $routeProvider
      //when / is requested, set login.html
      .when('/', {
        templateUrl: 'login.html'
      }).otherwise({
        redirectTo: '/index'
      });
    //change browsers url
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  })
]);
viewModel.run(function (sendHead) {
  sendHead.init();
});
