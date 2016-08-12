angular.module('noochApp.mapCtrl', ['ngCordova', 'noochApp.services','ngMap'])

//var myApp = angular.module('myApp', ['ngMap']);

.controller('mapCtrl', function ($scope, $state, authenticationService, $cordovaGoogleAnalytics, $ionicPlatform, profileService, $ionicLoading, $ionicContentBanner, $rootScope, selectRecipientService, CommonServices) {

    $scope.$on("$ionicView.enter", function (event, data) {

        console.log('map Ctrl loaded');
        $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC3f2pIfit--Qr7Tvl5EGnzvEHpDAIsYoI";

        $ionicPlatform.ready(function () {

           
              NgMap.getMap().then(function (map) {
                    console.log(map.getCenter());
                    console.log('markers', map.markers);
                    console.log('shapes', map.shapes);
                });
        

    
        });
    });

  

})