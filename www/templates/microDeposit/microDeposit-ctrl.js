angular.module('noochApp.microDepositCtrl', ['noochApp.services'])

.controller('microDepositCtrl', function ($scope, $state, $ionicLoading, $localStorage, $cordovaNetwork, $sce, $rootScope, $cordovaGoogleAnalytics, $ionicPlatform) {

    $scope.$on('$ionicView.beforeEnter', function () {
        if ($rootScope.bank_node == null)
            $state.go('app.settings');
        else
        {
            $ionicLoading.show({
                template: 'Loading...'
            });

            $scope.microDeposit();
        }

        $ionicPlatform.ready(function () {
            if (typeof analytics !== 'undefined') analytics.trackView("Micro Deposit");
        })
    });

    $scope.$on("$ionicView.afterEnter", function (event, data) {
        $ionicLoading.hide();
    })

    $scope.microDeposit = function () {
        //if ($cordovaNetwork.isOnline()) {
        // $scope.url = ' https://noochme.com/noochweb/Nooch/MicroDepositsVerification?mid=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&NodeId=' + $rootScope.bank_node;
        $scope.url = ' http://nooch.info/noochweb/Nooch/MicroDepositsVerification?mid=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&NodeId=' + $rootScope.bank_node + '&from=mobileapp';

        $scope.microDepositUrl = $sce.trustAsResourceUrl($scope.url);

        //  } else
        //    swal("Error", "Internet not connected!", "error");
    }
})
