sensibelControllers.controller('Home_Controller', function($scope, $location, $timeout, $sce, $routeParams, $log, $http, $filter, baseURL, assetsURL, sensibelAPI, NgMap) {

	$scope.journey;
	$scope.journeyDistance;
	$scope.journeyTime;
	$scope.images;
	$scope.title;
	$scope.titleIcon;
	$scope.description;
	$scope.mapType = "roadmap";
	$scope.numberPoints = 150;
	$scope.currentPointIndex = 0;
	$scope.points;
	$scope.trackPoints;
	$scope.point;
	$scope.contentLoading = false;
	$scope.polylineStrokeWeight = 3;
	$scope.galleryShowing = false;
	$scope.currentGalleryImage = '';
	$scope.sliderOptions = {
	  value: 0,
	  options: {
	    floor: 0,
	    ceil: 0,
	    onChange: function(){
	    	sliderChange();
	    },
	  },
	}

	$scope.showBack = function(){
		if($scope.sliderOptions.value != 0){
			return 'padding'
		}
	}

	$scope.activeMapType = function(type){
		if($scope.mapType == type){
			return 'active';
		}
	}

	sliderChange = function(index){
		if($scope.sliderOptions.value == 0){
			$scope.resetJourney();
		}else{
			for(var i = 0; i<$scope.points.length; i++){
				if(i == $scope.sliderOptions.value-1){
					$scope.loadPoint(null,$scope.points[i].ID);
				}
			}
		}
	}

	//map 
	$scope.bounds = new google.maps.LatLngBounds();

	$scope.getJourney = function(id){
		$scope.$parent.pageLoading = true;

		sensibelAPI.getObjects("Journey","/"+id).then(function(data){
			$scope.journey = data;
			$scope.images = $scope.journey.JourneyImages;
			$scope.title = "General Information";
			$scope.titleIcon = "img/i-icon.png";
			$scope.description =  $sce.trustAsHtml($scope.journey.Description);
			$scope.currentPointIndex = 0;
			$scope.journeyTime = $scope.journey.Time;

			$scope.createPoints($scope.journey.Points);
			$scope.createTrackPoints($scope.journey.TrackPoints);
			$scope.$parent.pageLoading = false;
	    });
	}

	$scope.createPoints = function(points){
		$scope.points = [];
		$scope.numberPoints = points.length;
		$scope.sliderOptions.value = 0;
		$scope.sliderOptions.options.ceil = points.length;
		//$scope.sliderOptions.onChange = $scope.sliderChange;



		for (i = 0; i < points.length; i++) {
	      var lat = points[i].Lat;
	      var lng = points[i].Lng;
	      var data = {
	      	'Position': [lat, lng],
	      	'ID': points[i].ID
	      }
	      if(points[i].PosNeg == 'good'){
	      	data['Icon'] = {
			    path: 'M 0, 0 m -10, 0 a 10, 10 0 1, 0 20, 0 a 10, 10 0 1, 0 -20, 0',
			    fillColor: '#fb6300',
			    fillOpacity: 1,
			    scale: 1,
			    strokeColor: '#FFFFFF',
			    strokeWeight: 2,
			    strokeOpacity: 1
			}
	      }else{
	      	data['Icon'] = {
			    path: 'M 0, 0 m -10, 0 a 10, 10 0 1, 0 20, 0 a 10, 10 0 1, 0 -20, 0',
			    fillColor: '#9acdb5',
			    fillOpacity: 1,
			    scale: 1,
			    strokeColor: '#FFFFFF',
			    strokeWeight: 2,
			    strokeOpacity: 1
			}
	      }
	      $scope.points.push(data);
	    }
	}

	$scope.createTrackPoints = function(trackPoints){
		$scope.trackPoints = [];
		
		for (i = 0; i < trackPoints.length; i++) {
	      var lat = trackPoints[i].Lat;
	      var lng = trackPoints[i].Lng;
	      $scope.trackPoints.push([lat, lng]);

	      var latlng = new google.maps.LatLng(lat, lng);
      	  $scope.bounds.extend(latlng);
      	  NgMap.getMap().then(function(map) {
		    map.setCenter($scope.bounds.getCenter());
		    map.fitBounds($scope.bounds);
		    map.setZoom(map.getZoom() - 1);
		  });
	    }

	    $scope.journeyDistance(trackPoints);
	    
	}

	$scope.markerOver = function(e,p){
		for(var i=0; i<$scope.points.length; i++){
			if(p == $scope.points[i].ID){
				$scope.points[i].Icon.path = 'M 0, 0 m -15, 0 a 15, 15 0 1, 0 30, 0 a 15, 15 0 1, 0 -30, 0';
			}
		}
	}

	$scope.markerOut = function(e,p){
		for(var i=0; i<$scope.points.length; i++){
			if(i != $scope.sliderOptions.value-1){
				$scope.points[i].Icon.path = 'M 0, 0 m -10, 0 a 10, 10 0 1, 0 20, 0 a 10, 10 0 1, 0 -20, 0';
			}
		}
	}

	$scope.polylineOver = function(e){
		
	}

	$scope.polylineOut = function(e){
		
	}

	$scope.fullScreenImage = function(image){
		$scope.currentGalleryImage = image.LanscapeImageBig;
		console.log($scope.currentGalleryImage);
	}

	$scope.loadPoint = function(e,id){
		
		$scope.contentLoading = true;
		$scope.images = [];

		for(var i=0; i<$scope.points.length; i++){
			if(id == $scope.points[i].ID){
				$scope.points[i].Icon.path = 'M 0, 0 m -15, 0 a 15, 15 0 1, 0 30, 0 a 15, 15 0 1, 0 -30, 0';
			}else{
				$scope.points[i].Icon.path = 'M 0, 0 m -10, 0 a 10, 10 0 1, 0 20, 0 a 10, 10 0 1, 0 -20, 0';
			}
		}

		sensibelAPI.getObjects("Point","/"+id).then(function(data){
			$scope.point = data;
			console.log($scope.point);
			$scope.titleIcon = $scope.point.PointCategory.IconPositiveLink;
			$scope.title = $scope.point.PointCategory.Title;
			$scope.description = $sce.trustAsHtml($scope.point.Description);

			$scope.images = $scope.point.Images;

			$scope.contentLoading = false;

			for(var i=0; i<$scope.points.length; i++){
				if($scope.point.ID == $scope.points[i].ID){
					console.log(i);
					$scope.sliderOptions.value = i+1;
				}
			}
	    });
	}

	$scope.isSmallerMap = function(){
		if($scope.$parent.pageLoading == false){
			return 'smaller';
		}
	}

	$scope.resetJourney = function(){

		$scope.sliderOptions.value = 0;
		$scope.images = $scope.journey.JourneyImages;
		$scope.title = "General Information";
		$scope.titleIcon = "img/i-icon.png";
		$scope.description =  $sce.trustAsHtml($scope.journey.Description);
		$scope.currentPointIndex = 0;
		$scope.journeyTime = $scope.journey.Time;

		for(var i=0; i<$scope.points.length; i++){
			$scope.points[i].Icon.path = 'M 0, 0 m -10, 0 a 10, 10 0 1, 0 20, 0 a 10, 10 0 1, 0 -20, 0';
		}
	}

	$scope.journeyDistance = function(trackPoints){

    	var linestring = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": []
               }
        };

        for (i = 0; i < trackPoints.length; i++) {
        	var lat = trackPoints[i].Lat;
      		var lng = trackPoints[i].Lng;
      		linestring.geometry.coordinates.push([lat, lng]);
        }

        $scope.journeyDistance = turf.lineDistance(linestring).toLocaleString();

    }

    $scope.sliderPrev = function(){
    	console.log($scope.sliderOptions.value);
    	if($scope.sliderOptions.value > 1 ){
    		$scope.sliderOptions.value--;
    		for(var i = 0; i<$scope.points.length; i++){
				if(i == $scope.sliderOptions.value-1){
					$scope.loadPoint(null,$scope.points[i].ID);
				}
			}
    	}else{
    		console.log($scope.sliderOptions.value);
    		$scope.sliderOptions.value = 0;
    		$scope.resetJourney();
    	}
    }

    $scope.sliderNext = function(){
    	if($scope.sliderOptions.value < $scope.numberPoints){
    		$scope.sliderOptions.value++;

    		for(var i = 0; i<$scope.points.length; i++){
				if(i == $scope.sliderOptions.value-1){
					$scope.loadPoint(null,$scope.points[i].ID);
				}
			}
    	}
    }

	$scope.changeMapType = function(type){
		$scope.mapType = type;
	}

    /* init */
    if($routeParams.jid){
		$scope.getJourney($routeParams.jid);
	}

});