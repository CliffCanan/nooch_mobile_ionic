angular.module('noochApp.HomeCtrl', ['noochApp.services'])


/****************/
/***   HOME   ***/
/****************/
.controller('HomeCtrl', function ($scope, $state, authenticationService, $cordovaGoogleAnalytics) {

    
 

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Home Ctrl loaded');
        console.log($cordovaGoogleAnalytics);
        $cordovaGoogleAnalytics.debugMode();
        $cordovaGoogleAnalytics.setUserId('USER_ID');
 

        $cordovaGoogleAnalytics.trackView('Home Screen');

      

        // track event
        
        $cordovaGoogleAnalytics.trackEvent('', '', '', 100);

        // add transaction
        
        $cordovaGoogleAnalytics.addTransaction('', '', '', '5', '1.29', 'EUR');

        // add transaction item
        
        $cordovaGoogleAnalytics.addTransactionItem(
          '1234', ' ', 'DD23444', ' ', '11.99', '1', 'GBP'
        );
         
    });

    $scope.goToSelectRecip = function () {
        $state.go('app.selectRecipient');
    }
 
})