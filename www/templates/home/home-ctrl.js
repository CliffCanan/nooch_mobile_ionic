angular.module('noochApp.HomeCtrl', ['ngCordova','noochApp.services'])


/****************/
/***   HOME   ***/
/****************/
.controller('HomeCtrl', function ($scope, $state, authenticationService, $cordovaGoogleAnalytics, $ionicPlatform) {

    
 

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Home Ctrl loaded');
        $ionicPlatform.ready(function () {
            console.log($cordovaGoogleAnalytics);
            $cordovaGoogleAnalytics.debugMode();
            $cordovaGoogleAnalytics.startTrackerWithId('UA-XXXXXXXX-X');
            $cordovaGoogleAnalytics.trackView('APP first screen');
        });
    });

     

    $scope.goToSelectRecip = function () {
        $state.go('app.selectRecipient');
    }
 
})