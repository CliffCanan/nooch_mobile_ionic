angular.module('noochApp.historyCtrl', ['noochApp.history-service', 'noochApp.services'])

/*****************/
/***  HISTORY  ***/
/*****************/
    .controller('historyCtrl', function ($scope, historyService, $ionicLoading, $localStorage) {

        $scope.$on("$ionicView.enter", function(event, data) {

            console.log('History Page Loaded');
        });

        //  if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });

        historyService.getTransferList().success(function (data) {
            $scope.transactionList = data;
       
            $scope.memberId = $localStorage.GLOBAL_VARIABLES.MemberId;
            $ionicLoading.hide();
        }).error(function (data) {
            console.log('eror' + data);
            $ionicLoading.hide();
        });
        //}
        //else{
        //        swal("Oops...", "Internet not connected!", "error");
        //      }
    });

