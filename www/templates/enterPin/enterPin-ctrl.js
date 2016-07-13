angular.module('noochApp.enterPin', ['noochApp.services'])


    .controller('enterPinCtrl', function ($scope) {

        $scope.$on("$ionicView.enter", function (event, data) {

            console.log('Enter Pin Controller loaded');
        });
    });

