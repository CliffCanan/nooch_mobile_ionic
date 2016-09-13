angular.module('noochApp.limitsAndFeesCtrl', ['noochApp.services'])

.controller('limitsAndFeesCtrl', function ($scope, $state, $ionicModal, $cordovaGoogleAnalytics, $ionicPlatform) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('limtsAndFees Ctrl Loadad');

        $ionicPlatform.ready(function () {

            if (typeof analytics !== undefined) analytics.trackView("limitsAndFees Controller");

            $scope.initEvent = function () {
                if (typeof analytics !== undefined) { analytics.trackEvent("Category", "Action", "Label", 25); }
            }

            analytics.startTrackerWithId('UA-36976317-2')
            analytics.trackView('limitsAndFees Screen')
            //analytics.trackEvent('Category', 'Action', 'Label', Value)
            //analytics.setUserId('my-user-id')
            analytics.debugMode()

            //console.log($cordovaGoogleAnalytics);
            //$cordovaGoogleAnalytics.debugMode();
            //$cordovaGoogleAnalytics.startTrackerWithId('UA-36976317-2');
            //$cordovaGoogleAnalytics.setUserId('UA-36976317-2');
            //$cordovaGoogleAnalytics.trackView('Home Screen');
        })
    })
})