'use strict';
var angular = require('angular');
var ngRoute = require('angular-route');
var storeAuth = require('./storeAuth');
var serverAuth = require('./serverAuth');
//set module and inject dependencies
var viewModel = angular.module('viewModel', ['ngRoute', 'storeAuth', 'serverAuth']);
    //use routeprovider to create different routes in the application
    viewModel.config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider){
        $routeProvider
            //when / is requested
            .when('/', {
                //set as template
                templateUrl: 'login.html',
                //associate controller
                controller: 'AuthUser'
            })
            .otherwise({redirectTo:'/'});
            //rewrite url so it does not have #
            $locationProvider.html5Mode({enabled:true, requireBase:false});
    }]);
