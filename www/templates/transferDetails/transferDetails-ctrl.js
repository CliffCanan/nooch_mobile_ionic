angular.module('noochApp.TransferDetailsCtrl', ['noochApp.enterPinForeground-service', 'noochApp.transferDetails-service', 'noochApp.services'])


       .controller('TransferDetailsCtrl', function ($scope, $stateParams, transferDetailsService, $ionicLoading, $localStorage, $state, $ionicModal, CommonServices, ValidatePin) {


           $ionicModal.fromTemplateUrl('templates/transferDetails/modalPin.html', {
               scope: $scope,
               animation: 'slide-in-up'
           }).then(function (modal) {
               $scope.modal = modal;
              
           });
            
           
           $scope.transferDetail = {};
           $scope.$on("$ionicView.enter", function (event, data) {

                

              

               console.log('Transfer Details Controller');
               
               console.log('oibject -> ' + JSON.stringify($stateParams.myParam));
               $scope.transferDetail = $stateParams.myParam;
               $scope.memberId = $localStorage.GLOBAL_VARIABLES.MemberId;
             

           })
           $scope.remindPayment = function () {

             
               swal({
                   title: "Are you sure?",
                   text: "Do you want to Send Reminder for this transaction?",
                   type: "warning",
                   showCancelButton: true,
                   confirmButtonColor: "#DD6B55",
                   confirmButtonText: "Yes - Send",
               }, function (isConfirm) {
                   if (isConfirm) {
                       $ionicLoading.show({
                           template: 'Sending Reminder ...'
                       });

                       transferDetailsService.RemindPayment($scope.transferDetail.TransactionId).success(function (data) {
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

           $scope.cancelPayment = function () {
               
               console.log("cancel payment" + $scope.transferDetail.TransactionId);
               swal({
                   title: "Are you sure?",
                   text: "Do you want to cancel this transaction?",
                   type: "warning",
                   showCancelButton: true,
                   confirmButtonColor: "#DD6B55",
                   confirmButtonText: "Yes - Cancel",
               }, function (isConfirm) {
                   if (isConfirm) {
                       $ionicLoading.show({
                           template: 'Cancelling Payment ...'
                       });
                       transferDetailsService.CancelRequest($scope.transferDetail.TransactionId).success(function (data) {
                           if (data.Result.indexOf('Successfully') > -1) {
                               swal("Cancelled...", data.Result, "success");
                               $ionicLoading.hide();
                               $state.go('app.history');
                           }
                          
                       }).error(function () { $ionicLoading.hide(); });
                   }
               });
           }

           $scope.rejectPayment = function () {

               console.log("cancel payment" + $scope.transferDetail.TransactionId);
               swal({
                   title: "Are you sure?",
                   text: "Do you want to reject this transaction?",
                   type: "warning",
                   showCancelButton: true,
                   confirmButtonColor: "#DD6B55",
                   confirmButtonText: "Yes - Reject",
               }, function (isConfirm) {
                   if (isConfirm) {
                       $ionicLoading.show({
                           template: 'Rejecting Payment ...'
                       });
                       transferDetailsService.RejectPayment($scope.transferDetail.TransactionId).success(function (data) {
                           if (data.Result.indexOf('Successfully') > -1) {
                               swal("Rejected...", data.Result, "success");
                               $ionicLoading.hide();
                               $state.go('app.history');
                           }
                           $ionicLoading.hide();
                       }).error(function () { $ionicLoading.hide(); });
                   }
               });
           }
          

           

           $scope.TransferMoney = function () {
               
               console.log("Transfer payment" + JSON.stringify( $scope.transferDetail.TransactionId));
               swal({
                   title: "Are you sure?",
                   text: "Do you want to Pay for this transaction?",
                   type: "warning",
                   showCancelButton: true,
                   confirmButtonColor: "#DD6B55",
                   confirmButtonText: "Yes - Pay",
               }, function (isConfirm) {
                   if (isConfirm) {

                       $scope.modal.show();

                       }
               });
           }

           $scope.CheckPin = function (Pin) {
               console.log('Check Pin Function called');
               if ($('#frmPinForeground').parsley().validate() == true) {
                   $scope.modal.hide();
                   console.log(Pin);

                   //if ($cordovaNetwork.isOnline()) {
                   $ionicLoading.show({
                       template: 'Loading ...'
                   });

                   CommonServices.GetEncryptedData(Pin).success(function (data) {
                       
                       $scope.transferDetail.PinNumber = data.Status;
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
                             
                              if ($scope.transferDetail.MemberId != $scope.transferDetail.RecepientId) {
                                  transferDetailsService.TransferMoney($scope.transferDetail).success(function (data) {
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
                              else if ($scope.transferDetail.MemberId == $scope.transferDetail.RecepientId && $scope.transferDetail.InvitationSentTo.length > 0) {
                                  transferDetailsService.TransferMoneyToNonNoochUserUsingSynapse($scope.transferDetail).success(function (data) {
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
                              else if ($scope.transferDetail.MemberId == $scope.transferDetail.RecepientId && $scope.transferDetail.PhoneNumberInvited.length > 0) {
                                  transferDetailsService.TransferMoneyToNonNoochUserThroughPhoneUsingsynapse($scope.transferDetail).success(function (data) {
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

       })