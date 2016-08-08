angular.module('noochApp.historyCtrl', ['noochApp.history-service', 'noochApp.services'])

/*****************/
/***  HISTORY  ***/
/*****************/
 
    .controller('historyCtrl', function ($scope, historyService, $ionicLoading, $localStorage, $ionicListDelegate, transferDetailsService, $rootScope, $ionicContentBanner, $state, $ionicModal, CommonServices, ValidatePin) {
        $ionicModal.fromTemplateUrl('templates/history/modalPin.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.$on("$ionicView.enter", function (event, data) {
            var transDetails = {};
            $scope.transDetailsForPin = {};
            console.log('History Page Loaded');

          

            //  if ($cordovaNetwork.isOnline()) {

            $ionicLoading.show({
                template: 'Loading History...'
            });
            $scope.transactionList = '';
            $scope.completed = true;
            $scope.pending = false;
            $('#btnCompleted').addClass('active');
            $('#btnPending').removeClass('active');
            $scope.clickCompleted = function () {

                $scope.completed = true;
                $scope.pending = false;

            }
            $scope.clickPending = function () {
                $scope.pending = true;
                $scope.completed = false;

            }
            historyService.getTransferList().success(function (data) {
                
                $scope.transactionList = data;
                 
                for (var i = 0; i < $scope.transactionList.length; i++) {
                   
                    $scope.transactionList[i].TransactionDate = new Date($scope.transactionList[i].TransactionDate);
                 
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

            $scope.PayBack = function (trans) {

                console.log("Pay Back" + JSON.stringify(trans));
                swal({
                    title: "Are you sure?",
                    text: "Do you want to Pay Back for this transaction?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes - Pay",
                }, function (isConfirm) {
                    if (isConfirm) {
                        $state.go('app.howMuch', { myParam: trans });
                        //  $scope.modal.show();
                    }
                });
            }

            $scope.TransferMoney = function (trans) {
                transDetails = trans;
                console.log("Transfer payment" + JSON.stringify(transDetails));
                swal({
                    title: "Are you sure?",
                    text: "Do you want to Pay for this transaction?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes - Pay",
                }, function (isConfirm) {
                    if (isConfirm) {
                        $scope.transDetailsForPin = {};
                        $scope.transDetailsForPin = transDetails;
                        console.log($scope.transDetailsForPin);
                        $scope.modal.show();
                    }
                });
            }

            $scope.CheckPin = function (Pin) {
              
                console.log('Check Pin Function called');
                console.log("Transfer payment" + JSON.stringify(transDetails));
             
               
                if ($('#frmPinForeground').parsley().validate() == true) {
                    $scope.modal.hide();
                    console.log(Pin);

                    //if ($cordovaNetwork.isOnline()) {
                    $ionicLoading.show({
                        template: 'Loading ...'
                    });

                    CommonServices.GetEncryptedData(Pin).success(function (data) {
                        console.log("Transfer payment" + JSON.stringify(transDetails));
                        transDetails.PinNumber = data.Status;
                        ValidatePin.ValidatePinNumberToEnterForEnterForeground(data.Status)
                       .success(function (data) {
                           // $scope.Data = data;
                           console.log(data);

                           $ionicLoading.hide();
                           if (data.Result == 'Success') {
                               console.log(data);
                               //code to transfer Money

                               $ionicLoading.show({
                                   template: 'Paying Payment ...'
                               });

                               if (transDetails.MemberId != transDetails.RecepientId) {
                                   transferDetailsService.TransferMoney(transDetails).success(function (data) {
                                       if (data.Result && data.Result.indexOf('Successfully') > -1) {
                                           swal("Payed...", data.Result, "success");
                                           $ionicLoading.hide();
                                       }
                                       else {
                                           swal("Error...", data.Result, "error");
                                           $ionicLoading.hide();
                                       }
                                       $ionicLoading.hide();
                                   }).error(function () { $ionicLoading.hide(); });
                               }
                               else if (transDetails.MemberId == transDetails.RecepientId && transDetails.InvitationSentTo.length > 0) {
                                   transferDetailsService.TransferMoneyToNonNoochUserUsingSynapse(transDetails).success(function (data) {
                                       if (data.Result && data.Result.indexOf('Successfully') > -1) {
                                           swal("Payed...", data.Result, "success");
                                           $ionicLoading.hide();
                                       }
                                       else {
                                           swal("Error...", data.Result, "error");
                                           $ionicLoading.hide();
                                       }
                                       $ionicLoading.hide();
                                   }).error(function () { $ionicLoading.hide(); });
                               }
                               else if (transDetails.MemberId == transDetails.RecepientId && transDetails.PhoneNumberInvited.length > 0) {
                                   transferDetailsService.TransferMoneyToNonNoochUserThroughPhoneUsingsynapse(transDetails).success(function (data) {
                                       if (data.Result && data.Result.indexOf('Successfully') > -1) {
                                           swal("Payed...", data.Result, "success");
                                           $ionicLoading.hide();
                                       }
                                       else {
                                           swal("Error...", data.Result, "error");
                                           $ionicLoading.hide();
                                       }
                                       $ionicLoading.hide();
                                   }).error(function () { $ionicLoading.hide(); });
                               }



                           }
                           else if (data.Result == 'Invalid Pin') {
                               swal({
                                   title: "Oops!",
                                   text: "Incorrect Pin .",
                                   type: "warning",

                                   confirmButtonColor: "#DD6B55",
                                   confirmButtonText: "Ok",
                               }, function (isConfirm) {
                                   if (isConfirm) {

                                       $scope.modal.show();

                                   }
                               });

                           }
                           else if (data.Message == 'An error has occurred.') {
                               swal("Oops...", "Something went wrong !", "error");
                           }

                       }).error(function (data) {
                           console.log('eror' + data);
                           $ionicLoading.hide();
                       });
                    }).error(function (data) { });

                    //}
                    //else {
                    //    swal("Oops...", "Internet not connected!", "error");
                    //}
                }
            };

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


