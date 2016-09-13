angular.module('noochApp.addBankCtrl', ['noochApp.services'])

.controller('addBankCtrl', function ($scope, $state, $ionicLoading, $localStorage, $cordovaNetwork, $sce,$cordovaGoogleAnalytics,$ionicPlatform) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('Add bank Controller loaded');

        $ionicPlatform.ready(function () {

            if (typeof analytics !== undefined) analytics.trackView("addBank Controller");

            $scope.initEvent = function () {
                if (typeof analytics !== undefined) { analytics.trackEvent("Category", "Action", "Label", 25); }
            }

            analytics.startTrackerWithId('UA-36976317-2')
            analytics.trackView('addBank Screen')
            //analytics.trackEvent('Category', 'Action', 'Label', Value)
            //analytics.setUserId('my-user-id')
            analytics.debugMode()

            //console.log($cordovaGoogleAnalytics);
            //$cordovaGoogleAnalytics.debugMode();
            //$cordovaGoogleAnalytics.startTrackerWithId('UA-36976317-2');
            //$cordovaGoogleAnalytics.setUserId('UA-36976317-2');
            //$cordovaGoogleAnalytics.trackView('Home Screen');
        })

        $scope.addBankFn();      
    })

    $scope.addBankFn = function () {
        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });
        console.log('From controller....')      
   
        $scope.url = 'http://nooch.info//noochweb//Nooch//AddBank?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId;
        $scope.trustedUrl = $sce.trustAsResourceUrl($scope.url);
        console.log($scope.trustedUrl);

        $ionicLoading.hide();

        //  }
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}        
    }

})
