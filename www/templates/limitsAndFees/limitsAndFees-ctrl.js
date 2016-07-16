angular.module('noochApp.limitsAndFeesCtrl', ['noochApp.services'])

.controller('limitsAndFeesCtrl', function ($scope, $state, $ionicModal) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('limtsAndFees Ctrl Loadad');
    })
})