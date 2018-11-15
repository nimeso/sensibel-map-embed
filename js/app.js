'use strict';

/* App Module */

var env = {};
// Import variables if present (from env.js)
if(window){
  Object.assign(env, window.sensibel_env);
}

var sensibel = angular.module('sensibel', [
  'ngRoute',
  'sensibelControllers',
  'ngAnimate',
  'ngMessages',
  'ui.bootstrap',
  'ngFileUpload',
  'ngTouch',
  'ngMaterial',
  'chart.js',
  'slickCarousel'
]);


sensibel.value('baseURL', env.baseURL);
sensibel.value('assetsURL', env.assetsURL);
sensibel.value('openApiPageName', env.openApiPageName);


sensibel.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'templates/home.html',
        controller:  'Home_Controller'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
]);