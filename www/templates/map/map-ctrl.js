angular.module('noochApp.mapCtrl', ['ngCordova', 'noochApp.services','ngMap'])

//var myApp = angular.module('myApp', ['ngMap']);

.controller('mapCtrl', function ($scope, $state, $ionicPlatform,  $ionicLoading, $ionicContentBanner, $rootScope,NgMap) {

    $scope.$on("$ionicView.enter", function (event, data) {

        console.log('map Ctrl loaded');
        $scope.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC3f2pIfit--Qr7Tvl5EGnzvEHpDAIsYoI';

        console.log('from map Ctrl');
        console.log($rootScope.Location.longi);
        console.log($rootScope.Location.lati);

        $ionicPlatform.ready(function () {

            NgMap.getMap().then(function (map) {
                console.log(map.getCenter());
                console.log('markers', map.markers);
                console.log('shapes', map.shapes);
            });

          
        });
    });

  

})