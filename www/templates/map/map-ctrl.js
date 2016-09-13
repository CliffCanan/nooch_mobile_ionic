angular.module('noochApp.mapCtrl', ['ngCordova', 'noochApp.services', 'ngMap'])

//var myApp = angular.module('myApp', ['ngMap']);

.controller('mapCtrl', function ($scope, $state, $ionicPlatform, $ionicLoading, $ionicContentBanner, $rootScope, NgMap, $cordovaGoogleAnalytics) {

    $scope.$on("$ionicView.enter", function (event, data) {

        console.log('map Ctrl loaded');
        $scope.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC3f2pIfit--Qr7Tvl5EGnzvEHpDAIsYoI';

        //console.log($rootScope.Location.longi);
        //console.log($rootScope.Location.lati);

        $ionicPlatform.ready(function () {

            var vm = this;
            NgMap.getMap().then(function (map) {
                // console.log(map);
                //map.markers = [31.3260, 75.5762];
                //map.shapes = 'lines';
                console.log(map.getCenter());
                console.log('markers', map.markers);
                console.log('shapes', map.shapes);

                vm.showCustomMarker = function (evt) {
                    map.customMarkers.foo.setVisible(true);
                    map.customMarkers.foo.setPosition(this.getPosition());
                }
                vm.closeCustomMarker = function (evt) {
                    this.style.display = 'none';
                }
            });
        });

        $ionicPlatform.ready(function () {
            if (typeof analytics !== 'undefined') analytics.trackView("Map");
        })
    }); 
});

