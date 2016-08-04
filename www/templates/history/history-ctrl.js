angular.module('noochApp.historyCtrl', ['noochApp.history-service', 'noochApp.services'])

/*****************/
/***  HISTORY  ***/
/*****************/
 
    .controller('historyCtrl', function ($scope, historyService, $ionicLoading, $localStorage, $ionicListDelegate, transferDetailsService, $rootScope, $ionicContentBanner, $state ) {
 
        $scope.$on("$ionicView.enter", function (event, data) {
           
            $scope.transactionList = '';
            $scope.completed = true;
            $scope.clickCompleted = function () {
                 
                $scope.completed = true;
                $scope.pending = false;
                
            }
            $scope.clickPending = function () {
                $scope.pending = true;
                $scope.completed = false;
                
            }
            
            
            console.log('History Page Loaded');

            //  if ($cordovaNetwork.isOnline()) {

            $ionicLoading.show({
                template: 'Loading History...'
            });

            historyService.getTransferList().success(function (data) {
                
                $scope.transactionList = data;
                 
                for (var i = 0; i < $scope.transactionList.length; i++) {
                   
                    $scope.transactionList[i].TransactionDate = new Date($scope.transactionList[i].TransactionDate);
                    console.log($scope.transactionList[i].TransactionDate);
                }
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
                                 
                                swal({ title: "Request Cancelled", text: data.Result, type: "success", confirmButtonColor: "#DD6B55", confirmButtonText: "Ok!" }, function () {
                                    $ionicLoading.hide();
                                    location.reload();
                                });
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
                                 

                                swal({ title: "Request Rejected", text: data.Result, type: "success", confirmButtonColor: "#DD6B55", confirmButtonText: "Ok!" }, function () {
                                    $ionicLoading.hide();
                                    location.reload();
                                });
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
                                swal({ title: "Sent", text: data.Result, type: "success", confirmButtonColor: "#DD6B55", confirmButtonText: "Ok!" }, function () {
                                    $ionicLoading.hide();
                                    location.reload();
                                });

                                
                                
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


