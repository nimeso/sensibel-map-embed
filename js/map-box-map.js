L.mapbox.accessToken = 'pk.eyJ1IjoibWNvbnRhZ2lvdXMiLCJhIjoiY2lmM3QwcHF3MnlhdnN1bTNzbGt3dGtpcCJ9.-ibR-trVwNs9Ix4CWhXSLg';
angular.module('MapBox', [])
  .directive('mapBoxMap', function() {
    return {
      restrict: 'A',
      scope: {
        lat: '=',
        lng: '=',
        mapId: '=',
        zoomLevel: '=',
        markers: '='
      },
      link: function($scope, $element, $attrs) {
        $scope.map = L.mapbox.map($element[0], $scope.mapId)
          .setView([$scope.lat, $scope.lng], $scope.zoomLevel);
        $scope.map.scrollWheelZoom.disable();
        if (!!$scope.markers) {
          $scope.markers.forEach(function(marker) {
            L.marker(marker, {
              icon: L.mapbox.marker.icon({
                'marker-size': 'large',
                'marker-symbol': 'town-hall',
                'marker-color': '#fa0'
              })
            }).addTo($scope.map);
          });
        }
        var featureLayer = L.mapbox.featureLayer()
          .addTo($scope.map);
        featureLayer.on('ready', function() {
          $scope.map.fitBounds($scope.map.getBounds());
        });
      }
    };
  });