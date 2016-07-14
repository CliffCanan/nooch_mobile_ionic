angular.module('noochApp.notificationCtrl', ['noochApp.services'])




/****************************/
/**  NOTIFICATION SETTINGS **/
/****************************/
.controller('notificationCtrl', function ($scope, $state, $ionicHistory) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('Notification Controller loaded');
    })

    $scope.GoBack = function () {
        console.log("Back Button Clicked");
        $ionicHistory.goBack();
    }
})
