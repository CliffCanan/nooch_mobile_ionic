angular.module('noochApp.addBankCtrl', ['noochApp.services'])

.controller('addBankCtrl', function ($scope, $state, $ionicLoading, $localStorage, $cordovaNetwork, $sce,$cordovaGoogleAnalytics,$ionicPlatform) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('Add bank Controller loaded');

        $ionicPlatform.ready(function () {
            if (typeof analytics !== undefined) analytics.trackView("addBank Controller");
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
