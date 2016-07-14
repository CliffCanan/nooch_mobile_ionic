angular.module('noochApp.profileCtrl', ['noochApp.services'])
.controller('profileCtrl', function ($scope, authenticationService, $state) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('My Profile page Loadad');
    })

    $scope.GoBack = function () {
        console.log("Back Button Clicked");
        $state.go('app.setting');
    }
})
