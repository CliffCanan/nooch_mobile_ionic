angular.module('noochApp.socialSettingCtrl', ['noochApp.services'])




.controller('socialSettingCtrl', function ($scope, authenticationService, $state, $ionicHistory) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('Social Setting Controller Loadad');

    })
    $scope.GoBack = function () {
        $ionicHistory.goBack();
    }
})




