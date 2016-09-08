angular.module('noochApp.microDepositCtrl', ['noochApp.services', 'noochApp.microDeposit-service'])

.controller('microDepositCtrl', function ($scope, $state, $ionicLoading, $localStorage, $cordovaNetwork, $sce, $rootScope) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log("microDepost ctrl Lodaded");

        $scope.isNodeIdFound();
    })

    $scope.isNodeIdFound = function () {
        if ($rootScope.bank_node == null) {
            swal("Opss..", "You are not allowed to verify MicroDeposit", "error");
        }
        else {
            $scope.microDeposit();
        }
    }


    $scope.microDeposit = function () {
        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });

        $scope.url = ' https://noochme.com/noochweb/Nooch/MicroDepositsVerification?mid=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&NodeId=' + $rootScope.bank_node;
        //console.log($scope.url);
        $scope.microDepositUrl = $sce.trustAsResourceUrl($scope.url);
        console.log($scope.microDepositUrl);

        $ionicLoading.hide();

        //  }
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}        
    }

})
