angular.module('noochApp.HomeCtrl', ['noochApp.services'])


/****************/
/***   HOME   ***/
/****************/
.controller('HomeCtrl', function ($scope, $state, authenticationService, $cordovaGoogleAnalytics) {

    
 

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Home Ctrl loaded');
        $cordovaGoogleAnalytics.debugMode();
        $cordovaGoogleAnalytics.startTrackerWithId('UA-000000-01');
        $cordovaGoogleAnalytics.setUserId('USER_ID');
        $cordovaGoogleAnalytics.trackView('Home Screen');
        $cordovaGoogleAnalytics.addTransaction('1234', 'Testing', '11.99', '5', '1.29', 'EUR');
        $cordovaGoogleAnalytics.addTransactionItem(
    '1234', 'Testing', 'DD23444', 'Testing', '11.99', '1', 'GBP'
  );
        console.log($cordovaGoogleAnalytics);
    });

    $scope.goToSelectRecip = function () {
        $state.go('app.selectRecipient');
    }
 
})