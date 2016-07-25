angular.module('noochApp.HomeCtrl', ['noochApp.services'])


/****************/
/***   HOME   ***/
/****************/
.controller('HomeCtrl', function ($scope, $state, authenticationService) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Home Ctrl loaded');
    });

    $scope.goToSelectRecip = function () {
        $state.go('app.selectRecipient');
    }
 
})