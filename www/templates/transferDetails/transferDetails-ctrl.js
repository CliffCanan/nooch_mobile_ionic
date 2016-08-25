angular.module('noochApp.transferDetailsCtrl', ['noochApp.enterPinForeground-service', 'noochApp.transferDetails-service', 'noochApp.services', 'ngMap'])

       .controller('transferDetailsCtrl', function ($scope, $stateParams, transferDetailsService, $ionicLoading, $localStorage, $state, $ionicModal, CommonServices, ValidatePin, $rootScope, $ionicPlatform, NgMap) {

           $ionicModal.fromTemplateUrl('templates/transferDetails/modalPin.html', {
               scope: $scope,
               animation: 'slide-in-up'
           }).then(function (modal) {
               $scope.modal = modal;
           });

           $scope.transDetail = {};

           $scope.$on("$ionicView.enter", function (event, data) {
               console.log('Transfer Details Cntrlr Fired');

               $rootScope.Location = {
                   longi: '',
                   lati: ''
               }

               var vm = this;
               NgMap.getMap().then(function (map) {

                   //console.log(map.getCenter());
                   //console.log('markers', map.markers);
                   //console.log('shapes', map.shapes);

                   vm.showCustomMarker = function (evt) {
                       map.customMarkers.foo.setVisible(true);
                       map.customMarkers.foo.setPosition(this.getPosition());
                   }

                   vm.closeCustomMarker = function (evt) {
                       this.style.display = 'none';
                   }
               });

               console.log('Transaction Obj -> ' + JSON.stringify($stateParams.trans));

               // Make sure there is a transaction object available
               if ($stateParams.trans == null) $state.go('app.history');
               else
               {
                   $scope.transDetail = $stateParams.trans;
                   $scope.memId = $localStorage.GLOBAL_VARIABLES.MemberId;

                   $rootScope.Location.lati = $scope.transDetail.Latitude;
                   $rootScope.Location.longi = $scope.transDetail.Longitude;

                   //console.log($rootScope.Location.longi);
                   //console.log($rootScope.Location.lati);

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
                   //  if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                   { CommonServices.logOut(); }
               });
           }

           $scope.cancelPayment = function () {

               console.log("cancel payment: [" + $scope.transDetail.TransactionId + ']');
               $ionicLoading.show({
                   template: 'Cancelling Request...'
               });
               transferDetailsService.CancelRequest($scope.transDetail.TransactionId).success(function (data) {
                   if (data.Result.indexOf('Successfully') > -1)
                   {
                       swal({ title: "Request Cancelled", text: data.Result, type: "success", confirmButtonColor: "#DD6B55", confirmButtonText: "Ok!" }, function () {
                           $ionicLoading.hide();
                           $state.go('app.history');
                       });

                   }

               }).error(function (data) {
                   $ionicLoading.hide();
                   // if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                   { CommonServices.logOut(); }
               });
           }

           $scope.rejectPayment = function () {

               console.log("cancel payment" + $scope.transDetail.TransactionId);
               $ionicLoading.show({
                   template: 'Rejecting Request...'
               });
               transferDetailsService.RejectPayment($scope.transDetail.TransactionId).success(function (data) {
                   if (data.Result.indexOf('Successfully') > -1)
                   {
                       swal({ title: "Request Rejected", text: data.Result, type: "success", confirmButtonColor: "#DD6B55", confirmButtonText: "Ok!" }, function () {
                           $ionicLoading.hide();
                           $state.go('app.history');
                       });

                   }
                   $ionicLoading.hide();
               }).error(function (data) {
                   $ionicLoading.hide();
                   // if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                   { CommonServices.logOut(); }
               });;
           }


           // CLIFF (7/31/16): THIS SHOULD NOT BE HERE. IF THE USER TAPS 'Pay' (for a Request they Received), IT SHOULD
           //                  SEND THE USER TO THE 'PIN' SCREEN TO COMPLETE THE PAYMENT.
           //                  IF THE USER TAPS 'Pay Back', IT SHOULD SEND THE USER TO THE 'HOW MUCH?' SCREEN SO THEY
           //                  CAN ENTER AN AMOUNT, THEN TO 'PIN' TO COMPLETE.
           $scope.TransferMoney = function () {

               $scope.transDetail.RecepientName = $scope.transDetail.Name;
               CommonServices.savePinValidationScreenData({ myParam: $scope.transDetail, type: 'transfer', returnUrl: 'app.history', returnPage: 'History', comingFrom: 'Transfer' });

               $state.go('enterPin');
               //  $scope.modal.show();
           }

           $scope.CheckPin = function (Pin) {
               console.log('Check Pin Function called');

               if ($('#frmPinForeground').parsley().validate() == true)
               {
                   $scope.modal.hide();
                   console.log(Pin);

                   //if ($cordovaNetwork.isOnline()) {
                   $ionicLoading.show({
                       template: 'Submitting...'
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

                                  // CC (8/23/16): THIS SHOULDN'T BE CALLING "TRANSFER MONEY"... IT COULD ONLY BE COMPLETING A REQUEST HERE ("HandleRequestMoney() on the server")
                                  if ($scope.transDetail.MemberId != $scope.transDetail.RecepientId)
                                  {
                                      transferDetailsService.TransferMoney($scope.transDetail).success(function (data) {
                                          $ionicLoading.hide();
                                          if (data.Result && data.Result.indexOf('Successfully') > -1)
                                              swal("Request Paid Successfully", data.Result, "success");
                                          else
                                              swal("Error", data.Result, "error");
                                      }).error(function () { $ionicLoading.hide(); });
                                  }
                                  // CC (8/23/16): COMMENTING THIS OUT B/C IT'S IMPOSSIBLE FOR A NON-NOOCH USER TO BE PAYING A REQUEST OR RECEIVING AN INVITE FROM THE APP
                                  //else if ($scope.transDetail.MemberId == $scope.transDetail.RecepientId && $scope.transDetail.InvitationSentTo.length > 0)
                                  //{
                                  //    transferDetailsService.TransferMoneyToNonNoochUserUsingSynapse($scope.transDetail).success(function (data) {
                                  //        $ionicLoading.hide();
                                  //        if (data.Result && data.Result.indexOf('Successfully') > -1)
                                  //            swal("Paid", data.Result, "success");
                                  //        else
                                  //            swal("Error", data.Result, "error");
                                  //    }).error(function () { $ionicLoading.hide(); });
                                  //}
                                  //else if ($scope.transDetail.MemberId == $scope.transDetail.RecepientId && $scope.transDetail.PhoneNumberInvited.length > 0)
                                  //{
                                  //    transferDetailsService.TransferMoneyToNonNoochUserThroughPhoneUsingsynapse($scope.transDetail).success(function (data) {
                                  //        $ionicLoading.hide();
                                  //        if (data.Result && data.Result.indexOf('Successfully') > -1)
                                  //            swal("Paid Successfully", data.Result, "success");
                                  //        else
                                  //            swal("Error...", data.Result, "error");
                                  //    }).error(function () { $ionicLoading.hide(); });
                                  //}
                              }
                              else if (data.Result == 'Invalid Pin')
                              {
                                  swal({
                                      title: "Incorrect PIN",
                                      text: "Please try again!",
                                      type: "warning",
                                      confirmButtonColor: "#DD6B55",
                                      confirmButtonText: "Ok",
                                  }, function (isConfirm) {
                                      if (isConfirm) $scope.modal.show();
                                  });
                              }
                              else if (data.Message == 'An error has occurred.')
                                  swal("Oh No!", "Looks like something went wrong - we're having some difficulty completing your request!", "error");

                          }).error(function (data) {
                              console.log('eror' + data);
                              $ionicLoading.hide();
                              if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                                  CommonServices.logOut();
                          });
                   }).error(function (data) {
                       if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                           CommonServices.logOut();
                   });

                   //}
                   //else {
                   //    swal("Oops...", "Internet not connected!", "error");
                   //}
               }
           };

           $scope.PayBack = function () {
               console.log("Pay Back" + JSON.stringify($scope.transDetail));
               $state.go('app.howMuch', { myParam: $scope.transDetail });;
           }

       })