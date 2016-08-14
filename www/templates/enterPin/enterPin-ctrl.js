angular.module('noochApp.enterPin', ['noochApp.services'])

    .controller('enterPinCtrl', function ($scope, $state, $stateParams, $localStorage, CommonServices, $ionicLoading, ValidatePin, transferDetailsService, howMuchService, $ionicHistory) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Enter Pin Controller loaded');
            var obj = CommonServices.getPinValidationScreenData();
            
            $scope.memId = '';
            $scope.Details = '';
            $scope.returnUrl = '';
            $scope.returnPage = '';
            $scope.comingFrom = '';
             
            $scope.memId = $localStorage.GLOBAL_VARIABLES.MemberId;
            $scope.Details.enterPin = '';
            $scope.Details = CommonServices.getPinValidationScreenData().myParam;
            console.log($scope.Details);
            $scope.returnUrl = CommonServices.getPinValidationScreenData().returnUrl;
            $scope.returnPage = CommonServices.getPinValidationScreenData().returnPage;
            $scope.comingFrom = CommonServices.getPinValidationScreenData().comingFrom;
            $scope.Details.enterPin = '';
            $("#pin").focus();
        });

        $scope.GoBack = function () {
            $stateParams = '';
            $scope.Details = '';

            $ionicHistory.clearCache().then(function () { $state.go($scope.returnUrl); });

            
        };

        $scope.getTransaction = function () {
            console.log($scope.Details.enterPin);
            var Pin = $scope.Details.enterPin;
            console.log(Pin);
            if (Pin.length == 4) {

                //if ($cordovaNetwork.isOnline()) {
                $ionicLoading.show({
                    template: 'Loading ...'
                });

                CommonServices.GetEncryptedData(Pin).success(function (data) {

                    $scope.Details.PinNumber = data.Status;
                    ValidatePin.ValidatePinNumberToEnterForEnterForeground(data.Status)
                   .success(function (data) {
                       // $scope.Data = data;
                       console.log(data);

                       $ionicLoading.hide();
                       if (data.Result == 'Success') {
                           console.log(data);
                           //code to transfer Money
                           if ($scope.returnUrl == 'app.home')
                           {
                               
                               $ionicHistory.clearCache().then(function () { $state.go($scope.returnUrl); });
                           }
                           $ionicLoading.show({
                               template: 'Transfering ...'
                           });
                           if ($scope.comingFrom == 'Transfer') {

                               if ($scope.Details.MemberId != $scope.Details.RecepientId && $scope.Details.RecepientId != null && $scope.Details.RecepientId != undefined) {
                                   
                                   transferDetailsService.TransferMoney($scope.Details).success(function (data) {
                                       $ionicLoading.hide();
                                       if (data.Result && data.Result.indexOf('Successfully') > -1) {
                                           swal({ title: "Transferred...", text: data.Result, type: "success" }
                                               , function()
                                               {
                                                   $scope.Details = '';
                                                   $ionicHistory.clearCache().then(function () { $state.go($scope.returnUrl); });
                                                   //$state.go($scope.returnUrl);
                                               }

                                               );
                                           
                                           
                                       }
                                       else {
                                           swal("Error...", data.Result, "error");

                                           $ionicLoading.hide();
                                       }
                                       $ionicLoading.hide();
                                   }).error(function () { $ionicLoading.hide(); });
                               }
                               else if (($scope.Details.MemberId == $scope.Details.RecepientId || $scope.Details.RecepientId == null || $scope.Details.RecepientId == undefined) && $scope.Details.InvitationSentTo !=undefined) {

                                   transferDetailsService.TransferMoneyToNonNoochUserUsingSynapse($scope.Details).success(function (data) {
                                       if (data.Result && data.Result.indexOf('Successfully') > -1) {
                                           swal({ title: "Transferred...", text: data.Result, type: "success" }
                                              , function () {
                                                  $scope.Details = '';
                                                  $ionicHistory.clearCache().then(function () { $state.go($scope.returnUrl); });
                                                  //$state.go($scope.returnUrl);
                                              }

                                              );
                                         
                                       }
                                       else {
                                           swal("Error...", data.Result, "error");
                                           $ionicLoading.hide();
                                       }
                                       $ionicLoading.hide();
                                   }).error(function () { $ionicLoading.hide(); });
                               }
                               else if (($scope.Details.MemberId == $scope.Details.RecepientId  || $scope.Details.RecepientId == null || $scope.Details.RecepientId == undefined)&& $scope.Details.PhoneNumberInvited!=undefined) {
                                   
                                   transferDetailsService.TransferMoneyToNonNoochUserThroughPhoneUsingsynapse($scope.Details).success(function (data) {
                                       if (data.Result && data.Result.indexOf('Successfully') > -1) {
                                           swal({ title: "Transferred...", text: data.Result, type: "success" }
                                              , function () {
                                                  $scope.Details = '';
                                                  $ionicHistory.clearCache().then(function () { $state.go($scope.returnUrl); });
                                                  //$state.go($scope.returnUrl);
                                              }

                                              );
                                       }
                                       else {
                                           swal("Error...", data.Result, "error");
                                           $ionicLoading.hide();
                                       }
                                       $ionicLoading.hide();
                                   }).error(function () { $ionicLoading.hide(); });
                               }

                           }

                           else if ($scope.comingFrom == 'Request') {

                               if ($scope.Details.SenderId != null) {
                                   console.log($scope.Details);
                                   howMuchService.RequestMoney($scope.Details).success(function (data) {

                                       if (data.Result.indexOf('successfully') > -1) {
                                           
                                           $ionicLoading.hide();
                                           $scope.Details.Amount = "";
                                           $scope.Details.Memo = "";
                                           $scope.Details = '';
                                           swal({ title: "Transferred...", text: data.Result, type: "success" }
                                                 , function () {
                                                      
                                                     $scope.Details = '';
                                                     $ionicHistory.clearCache().then(function () { $state.go($scope.returnUrl); });
                                                     //$state.go($scope.returnUrl);
                                                 }

                                                 );
                                           
                                          // $state.go($scope.returnUrl);
                                       }
                                       else {
                                         
                                           $ionicLoading.hide();
                                           swal("Error...", data.Result, "error");
                                           

                                       }
                                   }).error(function (data) {

                                       //    if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                                       $ionicLoading.hide();
                                       CommonServices.logOut();
                                   });
                               }
                               else if (($scope.Details.SenderId == null || $scope.Details.SenderId == undefined) && ($scope.Details.MoneySenderEmailId != null) && ($scope.Details.ContactNumber == null)) {

                                   howMuchService.RequestMoneyToNonNoochUserUsingSynapse($scope.Details).success(function (data) {

                                       if (data.Result.indexOf('successfully') > -1) {
                                           $ionicLoading.hide();
                                           $scope.Details.Amount = "";
                                           $scope.Details.Memo = "";
                                           $scope.Details = '';
                                           swal({ title: "Transferred...", text: data.Result, type: "success" }
                                                 , function () {
                                                     $scope.Details = '';
                                                     $ionicHistory.clearCache().then(function () { $state.go($scope.returnUrl); });
                                                     //$state.go($scope.returnUrl);
                                                 }

                                                 );

                                       }
                                       else {
                                           
                                           $ionicLoading.hide();
                                           swal("Error...", data.Result, "error");

                                       }
                                   }).error(function (data) {

                                       // if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                                       $ionicLoading.hide();
                                       CommonServices.logOut();
                                   });

                               }
                               else if (($scope.Details.SenderId== null) && ($scope.Details.contactNumber != null)) {
                                   console.log('sending request from mobile number');
                                   howMuchService.RequestMoneyToNonNoochUserThroughPhoneUsingSynapse($scope.Details, $scope.Details.contactNumber).success(function (data) {

                                       if (data.Result.indexOf('successfully') > -1) {
                                            
                                           $ionicLoading.hide();
                                           $scope.Details.Amount = "";
                                           $scope.Details.Memo = "";
                                           $scope.Details = '';
                                           swal({ title: "Transferred...", text: data.Result, type: "success" }
                                                 , function () {
                                                     $scope.Details = '';
                                                     $ionicHistory.clearCache().then(function () { $state.go($scope.returnUrl); });
                                                     //$state.go($scope.returnUrl);
                                                 }

                                                 );

                                       }
                                       else {
                                         
                                           $ionicLoading.hide();
                                           swal("Error...", data.Result, "error");

                                       }
                                   }).error(function (data) {
                                       $ionicLoading.hide();
                                       $scope.modal.hide();
                                       swal("Error...", data.Result, "error");
                                       //    if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                                       $ionicLoading.hide();
                                       CommonServices.logOut();
                                   });

                               }

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
 
                                   $scope.Details.enterPin = '';
                                  

                               }
                           });

                       }
                       else if (data.Message == 'An error has occurred.') {
                           swal("Oops...", "Something went wrong !", "error");
                       }

                   }).error(function (data) {
                       console.log('eror' + data);
                       $ionicLoading.hide();
                       //  if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                       {
                           $ionicLoading.hide();
                           CommonServices.logOut();
                       }
                   });
                }).error(function (data) {
                    //  if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                    {
                        $ionicLoading.hide();
                        CommonServices.logOut();
                    }
                });

                //}
                //else {
                //    swal("Oops...", "Internet not connected!", "error");
                //}
            }
        }
    });
