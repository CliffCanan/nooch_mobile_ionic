angular.module('noochApp.recentRecipientCtrl', ['noochApp.services'])
.controller('recentRecipientCtrl', function ($scope, authenticationService, $state, $ionicHistory) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('My Profile page Loadad');
    })

    $scope.GoBack = function () {
        $ionicHistory.goBack();
    }
})
