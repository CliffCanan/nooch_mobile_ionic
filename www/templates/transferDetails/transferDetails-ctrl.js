angular.module('noochApp.TransferDetailsCtrl', ['noochApp.enterPinForeground-service', 'noochApp.transferDetails-service', 'noochApp.services'])

       .controller('TransferDetailsCtrl', function ($scope, $stateParams, transferDetailsService, $ionicLoading, $localStorage, $state, $ionicModal, CommonServices, ValidatePin) {

           $ionicModal.fromTemplateUrl('templates/transferDetails/modalPin.html', {
               scope: $scope,
               animation: 'slide-in-up'
           }).then(function (modal) {
               $scope.modal = modal;
           });


           $scope.transDetail = {};

           $scope.$on("$ionicView.enter", function (event, data) {

               console.log('Transfer Details Cntrlr Fired');

               console.log('object -> ' + JSON.stringify($stateParams.trans));

               // Make sure there is a transaction object available
               if ($stateParams.trans == null)
               {
                   $state.go('app.history');
               }
               else
               {
                   $scope.transDetail = $stateParams.trans;
                   $scope.memId = $localStorage.GLOBAL_VARIABLES.MemberId;

                   $scope.typeLabelTxt = "";
                   $scope.labelTypeClr = "";

                   if (($scope.transDetail.TransactionType == 'Transfer' ||
                        $scope.transDetail.TransactionType == 'Invite'))
                   {
                       if ($scope.transDetail.MemberId == $scope.memId)
                       {
                           $scope.typeLabelTxt = "Transfer To";
                           $scope.labelTypeClr = "red";
                       }
                       else if ($scope.transDetail.MemberId != $scope.memId)
                       {
                           $scope.typeLabelTxt = "Transfer From";
                           $scope.labelTypeClr = "green";
                       }
                   }
                   else if ($scope.transDetail.TransactionType == 'Request')
                   {
                       if ($scope.transDetail.MemberId == $scope.memId)
                       { 

                           $scope.typeLabelTxt = "Request To";
                           $scope.labelTypeClr = "blue";
                       }
                       else if ($scope.transDetail.MemberId != $scope.memId)
                       {
                           $scope.typeLabelTxt = "Request From";
                           $scope.labelTypeClr = "blue";
                       }
                   }
                  
                   else if ($scope.transDetail.TransactionType == 'Reward')
                   {
                       if ($scope.transDetail.MemberId != $scope.memId)
                       {
                           $scope.typeLabelTxt = "Reward From";
                           $scope.labelTypeClr = "green";
                       }
                   }
                   else if ($scope.transDetail.TransactionType == 'Rent')
                   {
                       if ($scope.transDetail.MemberId == $scope.memId)
                       {
                           $scope.typeLabelTxt = "Rent To";
                           $scope.labelTypeClr = "red";
                       }
                       else if ($scope.transDetail.MemberId != $scope.memId)
                       {
                           $scope.typeLabelTxt = "Rent From";
                           $scope.labelTypeClr = "green";
                       }
                   }

                   $scope.mapGeoLabelTxt = "";
                   if ($scope.transDetail.City != null && $scope.transDetail.City.length > 0)
                   {
                       $scope.mapGeoLabelTxt = $scope.transDetail.City;

                       if ($scope.transDetail.State != null && $scope.transDetail.State.length > 0)
                           $scope.mapGeoLabelTxt += ", " + $scope.transDetail.State;
                   }
               }
           })

           $scope.remindPayment = function () {

               swal({
                   title: "Are you sure?",
                   text: "Do you want to send a reminder about this request to " + $scope.transDetail.Name + "?",
                   type: "warning",
                   showCancelButton: true,
                   confirmButtonColor: "#DD6B55",
                   confirmButtonText: "Yes - Send",
               }, function (isConfirm) {
                   if (isConfirm)
                   {
                       $ionicLoading.show({
                           template: 'Sending Reminder ...'
                       });

                       transferDetailsService.RemindPayment($scope.transDetail.TransactionId).success(function (data) {
                           if (data.Result.indexOf('successfully') > -1)
                           {
                               swal("Sent...", data.Result, "success");
                               $ionicLoading.hide();
                               $state.go('app.history');
                           }
                           else
                           {
                               swal("Error...", data.Result, "error");
                               $ionicLoading.hide();
                           }

                       }).error(function (data) {
                           $ionicLoading.hide();
                           if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                           { CommonServices.logOut(); }
                       });
                   }
               });
           }

           $scope.cancelPayment = function () {

               console.log("cancel payment: [" + $scope.transDetail.TransactionId + ']');

               swal({
                   title: "Are you sure?",
                   text: "Do you want to cancel this payment request to " + $scope.transDetail.Name + "?",
                   type: "warning",
                   showCancelButton: true,
                   confirmButtonColor: "#DD6B55",
                   confirmButtonText: "Yes - Cancel",
               }, function (isConfirm) {
                   if (isConfirm)
                   {
                       $ionicLoading.show({
                           template: 'Cancelling Request...'
                       });
                       transferDetailsService.CancelRequest($scope.transDetail.TransactionId).success(function (data) {
                           if (data.Result.indexOf('Successfully') > -1)
                           {
                               swal("Request Cancelled", data.Result, "success");
                               $ionicLoading.hide();
                               $state.go('app.history');
                           }

                       }).error(function (data) {
                           $ionicLoading.hide();
                           if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                           { CommonServices.logOut(); }
                       });
                   }
               });
           }

           $scope.rejectPayment = function () {

               console.log("cancel payment" + $scope.transDetail.TransactionId);
               swal({
                   title: "Are you sure?",
                   text: "Do you want to reject this payment request from " + $scope.transDetail.Name + "?",
                   type: "warning",
                   showCancelButton: true,
                   confirmButtonColor: "#DD6B55",
                   confirmButtonText: "Yes - Reject",
               }, function (isConfirm) {
                   if (isConfirm)
                   {
                       $ionicLoading.show({
                           template: 'Rejecting Request...'
                       });
                       transferDetailsService.RejectPayment($scope.transDetail.TransactionId).success(function (data) {
                           if (data.Result.indexOf('Successfully') > -1)
                           {
                               swal("Request Rejected", data.Result, "success");
                               $ionicLoading.hide();
                               $state.go('app.history');
                           }
                           $ionicLoading.hide();
                       }).error(function (data) {
                           $ionicLoading.hide();
                           if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                           { CommonServices.logOut(); }
                       });
                   }
               });
           }


           // CLIFF (7/31/16): THIS SHOULD NOT BE HERE. IF THE USER TAPS 'Pay' (for a Request they Received), IT SHOULD
           //                  SEND THE USER TO THE 'PIN' SCREEN TO COMPLETE THE PAYMENT.
           //                  IF THE USER TAPS 'Pay Back', IT SHOULD SEND THE USER TO THE 'HOW MUCH?' SCREEN SO THEY
           //                  CAN ENTER AN AMOUNT, THEN TO 'PIN' TO COMPLETE.
           $scope.TransferMoney = function () {

               console.log("Transfer payment" + JSON.stringify($scope.transDetail.TransactionId));
               swal({
                   title: "Are you sure?",
                   text: "Do you want to Pay for this transaction?",
                   type: "warning",
                   showCancelButton: true,
                   confirmButtonColor: "#DD6B55",
                   confirmButtonText: "Yes - Pay",
               }, function (isConfirm) {
                   if (isConfirm)
                   {
                       $scope.modal.show();
                   }
               });
           }

           // (CLIFF (7/31/16): SEE ABOVE NOTE - THIS SHOULD NOT BE HERE!
           $scope.CheckPin = function (Pin) {
               console.log('Check Pin Function called');

               if ($('#frmPinForeground').parsley().validate() == true)
               {
                   $scope.modal.hide();
                   console.log(Pin);

                   //if ($cordovaNetwork.isOnline()) {
                   $ionicLoading.show({
                       template: 'Loading ...'
                   });

                   CommonServices.GetEncryptedData(Pin).success(function (data) {

                       $scope.transDetail.PinNumber = data.Status;
                       ValidatePin.ValidatePinNumberToEnterForEnterForeground(data.Status)
                      .success(function (data) {
                          // $scope.Data = data;
                          console.log(data);

                          $ionicLoading.hide();
                          if (data.Result == 'Success')
                          {
                              console.log(data);
                              //code to transfer Money

                              $ionicLoading.show({
                                  template: 'Paying Payment ...'
                              });

                              if ($scope.transDetail.MemberId != $scope.transDetail.RecepientId)
                              {
                                  transferDetailsService.TransferMoney($scope.transDetail).success(function (data) {
                                      if (data.Result && data.Result.indexOf('Successfully') > -1)
                                      {
                                          swal("Payed...", data.Result, "success");
                                          $ionicLoading.hide();
                                      }
                                      else
                                      {
                                          swal("Error...", data.Result, "error");
                                          $ionicLoading.hide();
                                      }
                                      $ionicLoading.hide();
                                  }).error(function () { $ionicLoading.hide(); });
                              }
                              else if ($scope.transDetail.MemberId == $scope.transDetail.RecepientId && $scope.transDetail.InvitationSentTo.length > 0)
                              {
                                  transferDetailsService.TransferMoneyToNonNoochUserUsingSynapse($scope.transDetail).success(function (data) {
                                      if (data.Result && data.Result.indexOf('Successfully') > -1)
                                      {
                                          swal("Payed...", data.Result, "success");
                                          $ionicLoading.hide();
                                      }
                                      else
                                      {
                                          swal("Error...", data.Result, "error");
                                          $ionicLoading.hide();
                                      }
                                      $ionicLoading.hide();
                                  }).error(function () { $ionicLoading.hide(); });
                              }
                              else if ($scope.transDetail.MemberId == $scope.transDetail.RecepientId && $scope.transDetail.PhoneNumberInvited.length > 0)
                              {
                                  transferDetailsService.TransferMoneyToNonNoochUserThroughPhoneUsingsynapse($scope.transDetail).success(function (data) {
                                      if (data.Result && data.Result.indexOf('Successfully') > -1)
                                      {
                                          swal("Payed...", data.Result, "success");
                                          $ionicLoading.hide();
                                      }
                                      else
                                      {
                                          swal("Error...", data.Result, "error");
                                          $ionicLoading.hide();
                                      }
                                      $ionicLoading.hide();
                                  }).error(function () { $ionicLoading.hide(); });
                              }



                          }
                          else if (data.Result == 'Invalid Pin')
                          {
                              swal({
                                  title: "Oops!",
                                  text: "Incorrect Pin .",
                                  type: "warning",

                                  confirmButtonColor: "#DD6B55",
                                  confirmButtonText: "Ok",
                              }, function (isConfirm) {
                                  if (isConfirm)
                                  {

                                      $scope.modal.show();

                                  }
                              });

                          }
                          else if (data.Message == 'An error has occurred.')
                          {
                              swal("Oops...", "Something went wrong !", "error");
                          }

                      }).error(function (data) {
                          console.log('eror' + data);
                          $ionicLoading.hide();
                          if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                          { CommonServices.logOut(); }
                      });
                   }).error(function (data) {
                       if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                       { CommonServices.logOut(); }
                   });

                   //}
                   //else {
                   //    swal("Oops...", "Internet not connected!", "error");
                   //}
               }
           };

           $scope.PayBack = function () {

               console.log("Pay Back" + JSON.stringify($scope.transDetail));
               swal({
                   title: "Are you sure?",
                   text: "Do you want to Pay Back for this transaction?",
                   type: "warning",
                   showCancelButton: true,
                   confirmButtonColor: "#DD6B55",
                   confirmButtonText: "Yes - Pay",
               }, function (isConfirm) {
                   if (isConfirm) {
                       $state.go('app.howMuch',{myParam:$scope.transDetail});
                     //  $scope.modal.show();
                   }
               });
           }
           

       })