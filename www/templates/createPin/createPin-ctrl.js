angular.module('noochApp.createPin', ['noochApp.services'])

    .controller('createPinCtrl', function ($scope, $state) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Enter Pin Controller loaded');

            //$("#pin").focus();
        });

        //$scope.GoBack = function () {
        //    $ionicHistory.goBack();
        //};
    });
