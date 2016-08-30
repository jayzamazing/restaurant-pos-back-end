'use strict';
var angular = require('angular');
var ngRoute = require('angular-route');
var storeAuth = require('./storeauth');
var serverAuth = require('./serverauth');
var storeTable = require('./storetable');
var serverTable = require('./servertable');
var storeOrders = require('./storeorders');
var storeCheckout = require('./storecheckout.js');
//set module and inject dependencies
var viewModel = angular.module('viewModel', ['ngRoute', 'storeAuth',
'serverAuth', 'storeTable', 'serverTable', 'storeOrders', 'storeCheckout'
]);
    //use routeprovider to create different routes in the application
    viewModel.config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider){
        $routeProvider
            //when / is requested
            .when('/', {
                //set as template
                templateUrl: '/login.html',
                //associate controller
                controller: 'AuthUser'
            }).when('/tables', {
              //set as template
              templateUrl: '/tables.html',
              //associate controller
              controller: 'TableData'
            }).when('/orders', {
              //set as template
              templateUrl: '/orders.html',
              //associate controller
              controller: 'OrderData'
            }).when('/checkout', {
              //set as template
              templateUrl: '/checkout.html',
              //associate controller
              controller: 'Checkout'
            })
            .otherwise({redirectTo:'/'});
            //rewrite url so it does not have #
            $locationProvider.html5Mode({enabled:true, requireBase:false});
    }]);
