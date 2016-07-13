angular.module('noochApp.MenuCtrl', ['noochApp.services'])
.controller('MenuCtrl', function ($scope, authenticationService) {
    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('MenuCtrl ctrl loaded');
    });


    //$scope.settingsClick = function () {
    //    $state.go("app.setting");
    //};
})
