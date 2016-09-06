angular.module('noochApp.enterPin', ['noochApp.services', 'noochApp.enterPin-service'])

    .controller('enterPinCtrl', function ($scope, $state, $stateParams, $localStorage, CommonServices, $ionicLoading, ValidatePin, transferDetailsService, howMuchService, $ionicHistory, enterPinService) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Enter Pin Controller loaded');
            var obj = CommonServices.getPinValidationScreenData();

            $scope.memId = $localStorage.GLOBAL_VARIABLES.MemberId;
            $scope.Details = '';
            $scope.returnUrl = '';
            $scope.returnPage = '';
            $scope.comingFrom = '';

            $scope.Details.enterPin = '';
            $scope.Details = CommonServices.getPinValidationScreenData().myParam;

            console.log($scope.Details);

            $scope.returnUrl = CommonServices.getPinValidationScreenData().returnUrl;
            $scope.returnPage = CommonServices.getPinValidationScreenData().returnPage;
            $scope.comingFrom = CommonServices.getPinValidationScreenData().comingFrom;

            console.log($scope.comingFrom);

            $("#pin").focus();
        });

        $scope.GoBack = function () {
            if ($scope.returnUrl == 'app.howMuch') {
                console.log($scope.Details);
                $state.go($scope.returnUrl, { recip: $scope.Details });
            }

            if ($scope.returnUrl == 'app.transferDetails') {
                console.log($scope.Details);
                $state.go($scope.returnUrl, { trans: $scope.Details });
            }

            $stateParams = '';
            $scope.Details = '';

            $ionicHistory.clearCache().then(function () { $state.go($scope.returnUrl); });
        };

        $scope.getTransaction = function () {
            $scope.Details.Latitude = $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude;
            $scope.Details.Longitude = $localStorage.GLOBAL_VARIABLES.UserCurrentLongi;
            console.log($scope.Details);
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
                          
                           //code to transfer Money

                           if ($scope.returnUrl == 'app.home')
                               $ionicHistory.clearCache().then(function () { $state.go($scope.returnUrl); });

                           $ionicLoading.show({
                               template: 'Submitting Payment...'
                           });

						   console.log(JSON.stringify($scope.Details));
                           if ($scope.comingFrom == 'Transfer') {

                               if ($scope.Details.MemberId != $scope.Details.RecepientId && $scope.Details.RecepientId != null && $scope.Details.RecepientId != undefined) {

                                   enterPinService.TransferMoney($scope.Details).success(function (data) {
                                       $ionicLoading.hide();

                                       if (data.Result && data.Result.indexOf('Successfully') > -1) {
                                           //swal({ title: "Transferred...", text: data.Result, type: "success" }
										   //, function () {
										   //    $scope.Details = '';
										   //    $ionicHistory.clearCache().then(function () { $state.go($scope.returnUrl); });
										   //    //$state.go($scope.returnUrl);
                                           //});
                                           swal({
                                               title: "Transferred...",
                                               text: data.Result,
                                               type: "success",
                                               showCancelButton: true,
                                               confirmButtonColor: "#DD6B55",
                                               confirmButtonText: "View Details",
                                               cancelButtonText: "Okay",
                                               closeOnConfirm: true,
                                               closeOnCancel: true
                                           }, function (isConfirm) {
                                               if (isConfirm) {
                                                   $state.go('app.transferDetails');
                                               } else {
                                                   $scope.Details = '';
                                                   $ionicHistory.clearCache().then(function () {
                                                       $state.go($scope.returnUrl);
                                                   });
                                                   //$state.go($scope.returnUrl);
                                               }
                                           });
                                       }
                                       else
                                           swal("Error", data.Result, "error");
                                   }).error(function () { $ionicLoading.hide(); });
                               }
                               else if (($scope.Details.MemberId == $scope.Details.RecepientId || $scope.Details.RecepientId == null || $scope.Details.RecepientId == undefined) && $scope.Details.InvitationSentTo != undefined) {

                                   enterPinService.TransferMoneyToNonNoochUserUsingSynapse($scope.Details).success(function (data) {
                                       $ionicLoading.hide();

                                       if (data.Result && data.Result.indexOf('Successfully') > -1) {
                                           //swal({ title: "Transferred...", text: data.Result, type: "success" }
                                           //   , function () {
                                           //       $scope.Details = '';
                                           //       $ionicHistory.clearCache().then(function () { $state.go($scope.returnUrl); });
                                           //       //$state.go($scope.returnUrl);
                                           //   });
                                           swal({
                                               title: "Transferred...",
                                               text: data.Result,
                                               type: "success",
                                               showCancelButton: true,
                                               confirmButtonColor: "#DD6B55",
                                               confirmButtonText: "View Details",
                                               cancelButtonText: "Okay",
                                               closeOnConfirm: false,
                                               closeOnCancel: false
                                           }, function (isConfirm) {
                                               if (isConfirm) {
                                                   $state.go('app.transferDetails');
                                               } else {
                                                   $scope.Details = '';
                                                   $ionicHistory.clearCache().then(function () {
                                                       $state.go($scope.returnUrl);
                                                   });
                                                   //$state.go($scope.returnUrl);
                                               }
                                           });
                                       }
                                       else
                                           swal("Error", data.Result, "error");
                                   }).error(function () { $ionicLoading.hide(); });
                               }
                               else if (($scope.Details.MemberId == $scope.Details.RecepientId || $scope.Details.RecepientId == null || $scope.Details.RecepientId == undefined) && $scope.Details.PhoneNumberInvited != undefined) {

                                   enterPinService.TransferMoneyToNonNoochUserThroughPhoneUsingsynapse($scope.Details).success(function (data) {
                                       $ionicLoading.hide();

                                       if (data.Result && data.Result.indexOf('Successfully') > -1) {
                                           //swal({ title: "Transferred...", text: data.Result, type: "success" }
                                           //   , function () {
                                           //       $scope.Details = '';
                                           //       $ionicHistory.clearCache().then(function () { $state.go($scope.returnUrl); });
                                           //   });
                                           swal({
                                               title: "Transferred...",
                                               text: data.Result,
                                               type: "success",
                                               showCancelButton: true,
                                               confirmButtonColor: "#DD6B55",
                                               confirmButtonText: "View Details",
                                               cancelButtonText: "Okay",
                                               closeOnConfirm: false,
                                               closeOnCancel: false
                                           }, function (isConfirm) {
                                               if (isConfirm) {
                                                   $state.go('app.transferDetails');
                                               } else {
                                                   $scope.Details = '';
                                                   $ionicHistory.clearCache().then(function () {
                                                       $state.go($scope.returnUrl);
                                                   });
                                                   //$state.go($scope.returnUrl);
                                               }
                                           });
                                       }
                                       else
                                           swal("Error...", data.Result, "error");
                                   }).error(function () { $ionicLoading.hide(); });
                               }
                           }
                           else if ($scope.comingFrom == 'Request') {

                               if ($scope.Details.SenderId != null) {
                                   console.log($scope.Details);

                                   enterPinService.RequestMoney($scope.Details).success(function (data) {
                                       $ionicLoading.hide();

                                       if (data.Result.indexOf('successfully') > -1) {
                                           $scope.Details.Amount = "";
                                           $scope.Details.Memo = "";
                                           $scope.Details = '';
                                           //swal({ title: "Transferred...", text: data.Result, type: "success" }
                                           //      , function () {
                                           //          $scope.Details = '';
                                           //          $ionicHistory.clearCache().then(function () { $state.go($scope.returnUrl); });
                                           //          //$state.go($scope.returnUrl);
                                           //      });
                                           swal({
                                               title: "Transferred...",
                                               text: data.Result,
                                               type: "success",
                                               showCancelButton: true,
                                               confirmButtonColor: "#DD6B55",
                                               confirmButtonText: "View Details",
                                               cancelButtonText: "Okay",
                                               closeOnConfirm: false,
                                               closeOnCancel: false
                                           }, function (isConfirm) {
                                               if (isConfirm) {
                                                   $state.go('app.transferDetails');
                                               } else {
                                                   $scope.Details = '';
                                                   $ionicHistory.clearCache().then(function () {
                                                       $state.go($scope.returnUrl);
                                                   });
                                                   //$state.go($scope.returnUrl);
                                               }
                                           });
                                           // $state.go($scope.returnUrl);
                                       }
                                       else
                                           swal("Error", data.Result, "error");
                                   }).error(function (data) {
                                       $ionicLoading.hide();

                                       if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                                           CommonServices.logOut();
                                   });
                               }
                               else if (($scope.Details.SenderId == null || $scope.Details.SenderId == undefined) && ($scope.Details.MoneySenderEmailId != null) && ($scope.Details.ContactNumber == null)) {

                                   enterPinService.RequestMoneyToNonNoochUserUsingSynapse($scope.Details).success(function (data) {

                                       if (data.Result.indexOf('successfully') > -1) {
                                           $ionicLoading.hide();
                                           $scope.Details.Amount = "";
                                           $scope.Details.Memo = "";
                                           $scope.Details = '';
                                           //swal({ title: "Transferred...", text: data.Result, type: "success" }
                                           //      , function () {
                                           //          $scope.Details = '';
                                           //          $ionicHistory.clearCache().then(function () { $state.go($scope.returnUrl); });
                                           //          //$state.go($scope.returnUrl);
                                           //      });
                                           swal({
                                               title: "Transferred...",
                                               text: data.Result,
                                               type: "success",
                                               showCancelButton: true,
                                               confirmButtonColor: "#DD6B55",
                                               confirmButtonText: "View Details",
                                               cancelButtonText: "Okay",
                                               closeOnConfirm: false,
                                               closeOnCancel: false
                                           }, function (isConfirm) {
                                               if (isConfirm) {
                                                   $state.go('app.transferDetails');
                                               } else {
                                                   $scope.Details = '';
                                                   $ionicHistory.clearCache().then(function () {
                                                       $state.go($scope.returnUrl);
                                                   });
                                                   //$state.go($scope.returnUrl);
                                               }
                                           });
                                       }
                                       else {
                                           $ionicLoading.hide();
                                           swal("Error...", data.Result, "error");
                                       }
                                   }).error(function (data) {
                                       $ionicLoading.hide();

                                       if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                                           CommonServices.logOut();
                                   });
                               }
                               else if (($scope.Details.SenderId == null) && ($scope.Details.contactNumber != null)) {
                                   console.log('sending request from mobile number');
                                   enterPinService.RequestMoneyToNonNoochUserThroughPhoneUsingSynapse($scope.Details, $scope.Details.contactNumber).success(function (data) {
                                       $ionicLoading.hide();

                                       if (data.Result.indexOf('successfully') > -1) {
                                           $scope.Details.Amount = "";
                                           $scope.Details.Memo = "";
                                           $scope.Details = '';

                                           //swal({ title: "Transferred...", text: data.Result, type: "success" }
                                           //      , function () {
                                           //          $scope.Details = '';
                                           //          $ionicHistory.clearCache().then(function () { $state.go($scope.returnUrl); });
                                           //          //$state.go($scope.returnUrl);
                                           //      });
                                           swal({
                                               title: "Transferred...",
                                               text: data.Result,
                                               type: "success",
                                               showCancelButton: true,
                                               confirmButtonColor: "#DD6B55",
                                               confirmButtonText: "View Details",
                                               cancelButtonText: "Okay",
                                               closeOnConfirm: false,
                                               closeOnCancel: false
                                           }, function (isConfirm) {
                                               if (isConfirm) {
                                                   $state.go('app.transferDetails');
                                               } else {
                                                   $scope.Details = '';
                                                   $ionicHistory.clearCache().then(function () {
                                                       $state.go($scope.returnUrl);
                                                   });
                                                   //$state.go($scope.returnUrl);
                                               }
                                           });
                                       }
                                       else
                                           swal("Error...", data.Result, "error");
                                   }).error(function (data) {
                                       $ionicLoading.hide();
                                       $scope.modal.hide();
                                       swal("Error...", data.Result, "error");
                                       if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
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
                               if (isConfirm)
                                   $scope.Details.enterPin = '';
                           });
                       }
                       else if (data.Message == 'An error has occurred.')
                           swal("Error", "Something went wrong !", "error");
                   }).error(function (data) {
                       console.log('eror' + data);
                       $ionicLoading.hide();

                       if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                           CommonServices.logOut();
                   });
                }).error(function (data) {
                    $ionicLoading.hide();

                    if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                        CommonServices.logOut();
                });

                //}
                //else
                //    swal("Oops...", "Internet not connected!", "error");
            }
        }
    });
