'use strict';
var angular = require('angular');
var ngRoute = require('angular-route');
var storeAuth = require('./storeAuth');
var serverAuth = require('./serverAuth');

var viewModel = angular.module('viewModel', ['ngRoute', 'storeAuth', 'serverAuth']);
    //use routeprovider to create different routes in the application
    viewModel.config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider){
        $routeProvider
            //when / is requested
            .when('/', {
                templateUrl: 'login.html',
                controller: 'AuthUser'

            })
            .otherwise({redirectTo:'/'});

            $locationProvider.html5Mode({enabled:true, requireBase:false});
    }]);
