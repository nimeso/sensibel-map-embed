sensibelControllers.controller('Home_Controller', function($scope, $location, $timeout, $sce, $routeParams, $log, $http, $filter, baseURL, assetsURL, sensibelAPI, NgMap) {

	$scope.journey;
	$scope.images;
	$scope.title;
	$scope.titleIcon;
	$scope.description;
	$scope.mapType = "SATELLITE";
	$scope.numberPoints = 150;
	$scope.points;

	//map 
	$scope.bounds = new google.maps.LatLngBounds();

	$scope.getJourney = function(id){
		sensibelAPI.getObjects("Journey","/"+id).then(function(data){
			$scope.journey = data;
			$scope.images = $scope.journey.JourneyImages;
			$scope.title = "General Information";
			$scope.titleIcon = "img/i-icon.png";
			$scope.description =  $sce.trustAsHtml($scope.journey.Description);
			$scope.createPoints($scope.journey.Points);
			$scope.$parent.pageLoading = false;
	    });
	}

	$scope.createPoints = function(points){
		$scope.points = [];
		for (i = 0; i < points.length; i++) {
	      var lat = points[i].Lat;
	      var lng = points[i].Lng;
	      $scope.points.push([lat, lng]);
	      var latlng = new google.maps.LatLng(lat, lng);
      	  $scope.bounds.extend(latlng);
      	  NgMap.getMap().then(function(map) {
		    map.setCenter($scope.bounds.getCenter());
		    map.fitBounds($scope.bounds);
		  });
	    }
	}

	$scope.changeMapType = function(type){
		$scope.mapType = type;
	}

	if($routeParams.jid){
		$scope.getJourney($routeParams.jid);
	}



});