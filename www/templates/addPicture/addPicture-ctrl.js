angular.module('noochApp.addPicture', ['noochApp.services'])

    .controller('addPictureCtrl', function ($scope, $state) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Enter Pin Controller loaded');

            //$("#pin").focus();
        });

        //$scope.GoBack = function () {
        //    $state.go('howMuch');
        //};
    });
