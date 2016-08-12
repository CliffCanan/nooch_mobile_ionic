angular.module('noochApp.mapCtrl', ['ngCordova', 'noochApp.services','ngMap'])

//var myApp = angular.module('myApp', ['ngMap']);

.controller('mapCtrl', function ($scope, $state, authenticationService, $cordovaGoogleAnalytics, $ionicPlatform, profileService, $ionicLoading, $ionicContentBanner, $rootScope, selectRecipientService, CommonServices) {

    $scope.$on("$ionicView.enter", function (event, data) {

        console.log('map Ctrl loaded');
        $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE"; //Google server was not working for key.

        $ionicPlatform.ready(function () {

           // app.controller('MyController', function (NgMap) {
                ngMap.getMap().then(function (map) {
                    console.log(map.getCenter());
                    console.log('markers', map.markers);
                    console.log('shapes', map.shapes);
                });
            //});

    
        });
    });

  

})