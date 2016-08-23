'use strict';
var angular = require('angular');
var ngRoute = require('angular-route');
var storeAuth = require('./storeauth.js');
var serverAuth = require('./serverauth.js');
var storeTable = require('./storetable.js');
var serverTable = require('./servertable.js');
var storeOrders = require('./storeorders.js');
//set module and inject dependencies
var viewModel = angular.module('viewModel', ['ngRoute', 'storeAuth',
'serverAuth', 'storeTable', 'serverTable', 'storeOrders'
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
            })
            .otherwise({redirectTo:'/'});
            //rewrite url so it does not have #
            $locationProvider.html5Mode({enabled:true, requireBase:false});
    }]);
