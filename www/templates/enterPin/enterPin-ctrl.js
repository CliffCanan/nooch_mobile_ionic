angular.module('noochApp.enterPin', ['noochApp.services'])

    .controller('enterPinCtrl', function ($scope, $state) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Enter Pin Controller loaded');

            $("#pin").focus();
        });

        $scope.GoBack = function () {
            $state.go('howMuch');
        };
    });
