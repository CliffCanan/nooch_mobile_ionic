angular.module('noochApp.historyCtrl', ['noochApp.history-service', 'noochApp.services'])

/*****************/
/***  HISTORY  ***/
/*****************/
    .controller('historyCtrl', function ($scope, historyService, $ionicLoading, $localStorage, $rootScope) {
                
        $scope.$on("$ionicView.enter", function (event, data) {

            $scope.transactionList = '';
            console.log('History Page Loaded');

            //  if ($cordovaNetwork.isOnline()) {

            $ionicLoading.show({
                template: 'Loading History...'
            });

            historyService.getTransferList().success(function (data) {
                $scope.transactionList = data;

                $scope.memberId = $localStorage.GLOBAL_VARIABLES.MemberId;
                $ionicLoading.hide();
            }).error(function (data) {
                console.log('Get History Error: [' + data + ']');
                $ionicLoading.hide();
            });

            onSwipeDown = function () { alert(); }

            //}
            //else{
            //        swal("Oops...", "Internet not connected!", "error");
            //      }
        });

        
        console.log('outside the child');
        $scope.$on('IsVerifiedPhoneFalse', function () {
            console.log('phone is falsee');
            $scope.contentBannerInstance();
        });

        console.log('outside the child +1');
    });


