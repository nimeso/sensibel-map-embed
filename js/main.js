'use strict';

angular.module('sensibel')
.controller('mainController', [
	'$attrs', '$scope', '$routeParams', '$window', '$location', '$templateCache', '$timeout', '$sce', '$http', 'sensibelAPI',
	function($attrs, $scope, $routeParams, $window, $location, $templateCache, $timeout, $sce, $http, sensibelAPI) {
		
		$scope.pageLoading = true;

	}
	
]);
