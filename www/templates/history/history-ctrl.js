angular.module('noochApp.historyCtrl', ['noochApp.history-service', 'noochApp.services'])

/*****************/
/***  HISTORY  ***/
/*****************/
 
    .controller('historyCtrl', function ($scope, historyService, $ionicLoading, $localStorage, $ionicListDelegate, transferDetailsService, $rootScope, $ionicContentBanner) {
 
        $scope.$on("$ionicView.enter", function (event, data) {

            $scope.transactionList = '';
            $scope.click = function (val) {
                
                console.log(val);
                //$state.go('app.TransferDetails', { trans: trans });
            }
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
            $scope.cancelPayment = function (trans) {

                console.log("cancel payment: [" + trans.TransactionId + ']');

                swal({
                    title: "Are you sure?",
                    text: "Do you want to cancel this payment request to " + trans.Name + "?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes - Cancel",
                }, function (isConfirm) {
                    if (isConfirm) {
                        $ionicLoading.show({
                            template: 'Cancelling Request...'
                        });
                        transferDetailsService.CancelRequest(trans.TransactionId).success(function (data) {
                            if (data.Result.indexOf('Successfully') > -1) {
                                swal("Request Cancelled", data.Result, "success");
                                $ionicLoading.hide();
                                $state.go('app.history');
                            }

                        }).error(function () { $ionicLoading.hide(); });
                    }
                });
            }
            $scope.rejectPayment = function (trans) {

                console.log("cancel payment" + trans.TransactionId);
                swal({
                    title: "Are you sure?",
                    text: "Do you want to reject this payment request from " + trans.Name + "?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes - Reject",
                }, function (isConfirm) {
                    if (isConfirm) {
                        $ionicLoading.show({
                            template: 'Rejecting Request...'
                        });
                        transferDetailsService.RejectPayment(trans.TransactionId).success(function (data) {
                            if (data.Result.indexOf('Successfully') > -1) {
                                swal("Request Rejected", data.Result, "success");
                                $ionicLoading.hide();
                                $state.go('app.history');
                            }
                            $ionicLoading.hide();
                        }).error(function () { $ionicLoading.hide(); });
                    }
                });
            }
            $scope.remindPayment = function (trans) {

                swal({
                    title: "Are you sure?",
                    text: "Do you want to send a reminder about this request to " + trans.Name + "?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes - Send",
                }, function (isConfirm) {
                    if (isConfirm) {
                        $ionicLoading.show({
                            template: 'Sending Reminder ...'
                        });

                        transferDetailsService.RemindPayment(trans.TransactionId).success(function (data) {
                            if (data.Result.indexOf('successfully') > -1) {
                                swal("Sent...", data.Result, "success");
                                $ionicLoading.hide();
                                $state.go('app.history');
                            }
                            else {
                                swal("Error...", data.Result, "error");
                                $ionicLoading.hide();
                            }

                        }).error(function (data) {
                            $ionicLoading.hide();
                        });
                    }
                });
            }
            //}
            //else{
            //        swal("Oops...", "Internet not connected!", "error");
            //      }
        });
 
        $scope.$on('IsVerifiedPhoneFalse', function (event, args) {
            console.log('IsVerifiedPhoneFalse');
            $scope.contentBannerInstance();
        });

        $scope.contentBannerInstance = function () {
            $ionicContentBanner.show({

                text: ['Phone Number Not verified'],
                interval: '20',
                autoClose: '',
                type: 'error',
                transition: 'vertical'
            });
        }
 
    });


