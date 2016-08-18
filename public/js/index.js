'use strict';
//set ngroute as dependency of app
var viewModel = angular.module('viewModel', ['ngRoute', 'storeAuth', 'serverAuth']);
//use routeprovider to create different routes in the application
viewModel.config(['$routeProvider', '$locationProvider',
  viewModel.config(function($routeProvider, $locationProvider) {
    $routeProvider
      //when / is requested
      .when('/', {
        //set login.html and AuthUser controller
        templateUrl: 'login.html',
        controller: 'AuthUser'
      //default fallback
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
//kickstart app
viewModel.run(function (sendHead) {
  sendHead.init();
});
