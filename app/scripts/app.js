'use strict';

/**
 * @ngdoc overview
 * @name bocFrontendApp
 * @description
 * # bocFrontendApp
 *
 * Main module of the application.
 */
angular
  .module('bocFrontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'nvd3ChartDirectives',
    'd3'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'ApihourCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
