'use strict';

var storeAuth = angular.module('storeAuth', []);
storeAuth.controller('AuthUser',
['$scope', '$location', 'clientAuth', 'storeToken'])
