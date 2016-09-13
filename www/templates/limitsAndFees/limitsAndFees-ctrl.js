angular.module('noochApp.limitsAndFeesCtrl', ['noochApp.services'])

.controller('limitsAndFeesCtrl', function ($scope, $state, $ionicModal, $cordovaGoogleAnalytics, $ionicPlatform) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('limtsAndFees Ctrl Loadad');

        $ionicPlatform.ready(function () {
            if (typeof analytics !== 'undefined') analytics.trackView("limitsAndFees Controller");
        })
    })
})