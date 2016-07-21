angular.module('noochApp.enterPinForegroundCtrl', ['noochApp.services'])

    .controller('enterPinForegroundCtrl', function ($scope, $state) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Enter Pin Controller loaded');

           
        });

        //$scope.GoBack = function () {
        //    $state.go('howMuch');
        //};
    });
