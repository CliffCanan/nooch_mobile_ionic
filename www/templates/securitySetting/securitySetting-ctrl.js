angular.module('noochApp.securitySettingCtrl', ['noochApp.services'])
/***************************/
/***  SECURITY SETTINGS  ***/
/***************************/
.controller('securitySettingCtrl', function ($scope, authenticationService, $state,$ionicHistory) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Security Settings Screen Loadad');
    })

    $scope.GoBack = function () {
        $ionicHistory.goBack();
    }
})
