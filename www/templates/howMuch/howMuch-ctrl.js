angular.module('noochApp.howMuchCtrl', ['ngCordova', 'noochApp.howMuch-service', 'noochApp.services'])

.controller('howMuchCtrl', function ($scope, $state, $ionicPlatform, $ionicHistory, $stateParams, $ionicModal, howMuchService, $localStorage, $ionicPopup, CommonServices, ValidatePin, $ionicLoading, $cordovaCamera, $cordovaImagePicker) {

    var type = '';

    $scope.recipientDetail = {};
    $scope.requestData = {
        "PinNumber": "",
        "MemberId": "",
        "SenderId": "",
        "Name": "",
        "Amount": "",
        "TransactionId": "",
        "TransactionDate": "",
        "DeviceId": "",
        "Latitude": "",
        "Longitude": "",
        "Altitude": "",
        "AddressLine1": "",
        "AddressLine2": "",
        "City": "",
        "State": "",
        "Country": "",
        "ZipCode": "",
        "Memo": "",
        "Status": "",
        "MoneySenderEmailId": "",
        "Picture": "",
        "isTesting": "",
        "isRentPayment": ""
    }

    $scope.sendData = {
        "IsPrePaidTransaction": false,
        "IsPhoneInvitation": false,
        "IsExistingButNonRegUser": false,
        "doNotSendEmails": false,
        "isRentAutoPayment": false,
        "isRentScene": false,
        "Amount": "",
        "TransactionFee": 0,
        "TotalRecordsCount": "",
        "TransDate": "",
        "PinNumber": null,
        "MemberId": "",
        "NoochId": "",
        "RecepientId": "",
        "Status": null,
        "TransactionId": "",
        "Name": "Rent Scene",
        "RecepientName": null,
        "Memo": "hshs",
        "TransactionDate": "",
        "DeviceId": null,
        "Latitude": "",
        "Longitude": "",
        "AddressLine1": "",
        "AddressLine2": "",
        "City": "",
        "State": "",
        "Country": "",
        "ZipCode": "",
        "DisputeStatus": null,
        "DisputeId": null,
        "DisputeReportedDate": "",
        "DisputeReviewDate": "",
        "DisputeResolvedDate": "",
        "TransactionType": "",
        "TransactionStatus": "",
        "Photo": "",
        "FirstName": "Rent",
        "LastName": "Scene",
        "SenderPhoto": null,
        "RecepientPhoto": null,
        "synapseTransResult": null,
        "InvitationSentTo": null,
        "PhoneNumberInvited": null,
        "Date": null,
        "Time": null,
        "LocationId": null,
        "Location": null,
        "AdminNotes": null,
        "RaisedBy": null,
        "Picture": null,
        "BankPicture": null,
        "BankAccountId": null,
        "BankId": null,
        "BankName": null,
        "SsnIsVerified": null,
        "cip": null
    }

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('HowMuchCntrl Fired');

        $ionicModal.fromTemplateUrl('templates/howMuch/modalPin.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;

        });

        console.log($stateParams);

        if (typeof $stateParams.myParam == 'object')
        {
            if ($stateParams.myParam == null)
                $state.go('app.selectRecipient');

            $scope.recipientDetail = $stateParams.myParam;
        }
        else if (isNaN($stateParams.myParam))
        {
            //'mail'
            $scope.recipientDetail.UserName = $stateParams.myParam;
        }
        else if (!isNaN($stateParams.myParam))
        {
            $scope.recipientDetail.ContactNumber = $stateParams.myParam;
            alert('num');
        }

        $('#howMuchForm').parsley();

        $(".amount-container input").focus();
    });

    $(".amount-container input").focusout(function () {
        if ($(".amount-container input").val().trim().length > 0)
        {
            if ($(this).parsley().validate() != true)
                $(this).focus();
            else
            {
                var enteredAmnt = $(".amount-container input").val().trim();
                if (enteredAmnt.indexOf(".") == -1)
                    $(".amount-container input").val(enteredAmnt + ".00");
                else if (enteredAmnt.indexOf(".") > enteredAmnt.length - 3)
                    $(".amount-container input").val(enteredAmnt + "0");
            }
        }

        console.log($('#howMuchForm').parsley().validate());
    });

    //$scope.GoBack = function () {
    //    $state.go('app.selectRecipient');
    //};

    $scope.submitRequest = function () {
        type = 'request';

        console.log($('#howMuchForm').parsley().validate());

        if ($('#howMuchForm').parsley().validate() == true)
        {
            $scope.modal.show();
            // $state.go('enterPin');
        }
    };


    $scope.submitSend = function () {
        type = 'send';

        console.log($scope.recipientDetail.Amount);

        if ($('#howMuchForm').parsley().validate() == true)
        {
            console.log($scope.recipientDetail);
            $scope.modal.show();

            $('#input.pin').focus();
            // $state.go('enterPin');
        }
    }


    $scope.CheckPin = function (Pin) {
        console.log('Check Pin Function called');
        if ($('#frmPinForeground').parsley().validate() == true)
        {

            console.log(Pin);

            //if ($cordovaNetwork.isOnline()) {
            $ionicLoading.show({
                template: 'Loading ...'
            });

            CommonServices.GetEncryptedData(Pin).success(function (data) {
                console.log(data.Status);
                $scope.requestData.PinNumber = data.Status;
                $scope.sendData.PinNumber = data.Status;
                ValidatePin.ValidatePinNumberToEnterForEnterForeground(data.Status)
               .success(function (data) {
                   // $scope.Data = data;
                   console.log($scope.data);


                   if (data.Result == 'Success')
                   {
                       console.log(type);

                       if (type == 'request')
                       {
                           console.log($scope.recipientDetail);
                           $scope.requestData.MemberId = $localStorage.GLOBAL_VARIABLES.MemberId;
                           $scope.requestData.Amount = $scope.recipientDetail.Amount;
                           $scope.requestData.SenderId = $scope.recipientDetail.MemberId;
                           $scope.requestData.Name = $scope.recipientDetail.FirstName + ' ' + $scope.recipientDetail.LastName;
                           $scope.requestData.Memo = $scope.recipientDetail.Memo;
                           $scope.requestData.Picture = $scope.picture;
                           $scope.requestData.MoneySenderEmailId = $scope.recipientDetail.UserName;
                           if ($scope.recipientDetail.MemberId != null)
                           {
                               howMuchService.RequestMoney($scope.requestData).success(function (data) {

                                   if (data.Result.indexOf('successfully') > -1)
                                   {
                                       $scope.modal.hide();
                                       $ionicLoading.hide();
                                       swal("Success...", data.Result, "success");
                                       $scope.recipientDetail.Amount = "";
                                       $scope.recipientDetail.Memo = "";

                                   }
                                   else
                                   {
                                       $scope.modal.hide();
                                       $ionicLoading.hide();
                                       swal("Error...", data.Result, "error");

                                   }
                               }).error(function (data) {

                                   //    if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                                   CommonServices.logOut();
                               });
                           }
                           else if (($scope.recipientDetail.MemberId == null) && ($scope.recipientDetail.UserName != null) && ($scope.recipientDetail.ContactNumber == null))
                           {

                               howMuchService.RequestMoneyToNonNoochUserUsingSynapse($scope.requestData).success(function (data) {

                                   if (data.Result.indexOf('successfully') > -1)
                                   {
                                       $scope.modal.hide();
                                       $ionicLoading.hide();
                                       swal("Success...", data.Result, "success");
                                       $scope.recipientDetail.Amount = "";
                                       $scope.recipientDetail.Memo = "";

                                   }
                                   else
                                   {
                                       $scope.modal.hide();
                                       $ionicLoading.hide();
                                       swal("Error...", data.Result, "error");

                                   }
                               }).error(function (data) {

                                   // if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                                   CommonServices.logOut();
                               });

                           }
                           else if (($scope.recipientDetail.MemberId == null) && ($scope.recipientDetail.ContactNumber != null))
                           {
                               console.log('sending request from mobile number');
                               howMuchService.RequestMoneyToNonNoochUserThroughPhoneUsingSynapse($scope.requestData, $scope.recipientDetail.ContactNumber).success(function (data) {

                                   if (data.Result.indexOf('successfully') > -1)
                                   {
                                       $scope.modal.hide();
                                       $ionicLoading.hide();
                                       swal("Success...", data.Result, "success");
                                       $scope.recipientDetail.Amount = "";
                                       $scope.recipientDetail.Memo = "";

                                   }
                                   else
                                   {
                                       $scope.modal.hide();
                                       $ionicLoading.hide();
                                       swal("Error...", data.Result, "error");

                                   }
                               }).error(function (data) {
                                   $ionicLoading.hide();
                                   $scope.modal.hide();
                                   swal("Error...", data.Result, "error");
                                   //    if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                                   CommonServices.logOut();
                               });

                           }
                       }
                       else if (type == 'send')
                       {
                           console.log($scope.recipientDetail);
                           $scope.sendData.MemberId = $localStorage.GLOBAL_VARIABLES.MemberId;
                           $scope.sendData.Amount = $scope.recipientDetail.Amount;
                           $scope.sendData.RecepientId = $scope.recipientDetail.MemberId;
                           $scope.sendData.RecepientName = $scope.recipientDetail.FirstName + ' ' + $scope.recipientDetail.LastName;
                           $scope.sendData.Memo = $scope.recipientDetail.Memo;
                           $scope.sendData.Picture = $scope.picture;

                           if ($scope.recipientDetail.MemberId != null)
                           {
                               howMuchService.TransferMoney($scope.sendData).success(function (data) {
                                   if (data.Result && data.Result.indexOf('Successfully') > -1)
                                   {
                                       $ionicLoading.hide();
                                       $scope.modal.hide();
                                       $scope.recipientDetail.Amount = "";
                                       $scope.recipientDetail.Memo = "";
                                       swal("Payed...", data.Result, "success");

                                   }

                                   else
                                   {
                                       $ionicLoading.hide();
                                       $scope.modal.hide();
                                       swal("Error...", data.Result, "error");

                                   }
                                   $ionicLoading.hide();
                               }).error(function (data) {
                                   $ionicLoading.hide();
                                   $scope.modal.hide();
                                   swal("Error...", data.Result, "error");
                                   //  if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                                   CommonServices.logOut();
                               });
                           }
                           else if (($scope.recipientDetail.MemberId == null) && ($scope.recipientDetail.UserName != null) && ($scope.recipientDetail.ContactNumber == null))
                           {
                               howMuchService.TransferMoneyToNonNoochUserUsingSynapse($scope.sendData, $scope.recipientDetail.UserName).success(function (data) {
                                   if (data.Result && data.Result.indexOf('Successfully') > -1)
                                   {
                                       $ionicLoading.hide();
                                       $scope.modal.hide();
                                       $scope.recipientDetail.Amount = "";
                                       $scope.recipientDetail.Memo = "";
                                       swal("Payed...", data.Result, "success");

                                   }

                                   else
                                   {
                                       $ionicLoading.hide();
                                       $scope.modal.hide();
                                       swal("Error...", data.Result, "error");

                                   }
                                   $ionicLoading.hide();
                               }).error(function (data) {
                                   $ionicLoading.hide();
                                   $scope.modal.hide();
                                   //  if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                                   CommonServices.logOut();
                               });
                           }
                           else if (($scope.recipientDetail.MemberId == null) && ($scope.recipientDetail.ContactNumber != null))
                           {
                               howMuchService.TransferMoneyToNonNoochUserThroughPhoneUsingsynapse($scope.sendData, $scope.recipientDetail.ContactNumber).success(function (data) {
                                   if (data.Result && data.Result.indexOf('Successfully') > -1)
                                   {
                                       $ionicLoading.hide();
                                       $scope.modal.hide();
                                       $scope.recipientDetail.Amount = "";
                                       $scope.recipientDetail.Memo = "";
                                       swal("Payed...", data.Result, "success");

                                   }

                                   else
                                   {
                                       $ionicLoading.hide();
                                       $scope.modal.hide();
                                       swal("Error...", data.Result, "error");

                                   }
                                   $ionicLoading.hide();
                               }).error(function (data) {
                                   $ionicLoading.hide();
                                   $scope.modal.hide();
                                   //  if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                                   CommonServices.logOut();
                               });
                           }
                       }
                   }
                   else if (data.Result == 'Invalid Pin')
                   {
                       $scope.modal.hide();
                       $ionicLoading.hide();
                       swal("Oops...", "Incorrect Pin !", "error");

                   }
                   else if (data.Message == 'An error has occurred.')
                   {
                       $scope.modal.hide();
                       $ionicLoading.hide();
                       swal("Oops...", "Something went wrong !", "error");
                   }

               }).error(function (data) {
                   console.log('eror' + data);
                   $scope.modal.hide();
                   $ionicLoading.hide();
                   //  if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                   CommonServices.logOut();
               });
            }).error(function (data) {
                $scope.modal.hide();
                //if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                CommonServices.logOut();
            });
            //}
            //else {
            //    swal("Oops...", "Internet not connected!", "error");
            //}
        }
    };



    $scope.addImage = function () {

        $ionicPlatform.ready(function () {

            //window.imagePicker.getPictures(function (results) {
            //    for (var i = 0; i < results.length; i++)
            //    {
            //        console.log('Image URI: ' + results[i]);
            //    }
            //}, function (error) {
            //    console.log('Error: ' + error);
            //}, {
            //    maximumImagesCount: 1,
            //    width: 800
            //}
            //);

            var options = {
                maximumImagesCount: 10,
                width: 800,
                height: 800,
                quality: 80
            };
            console.log($cordovaImagePicker);
            $cordovaImagePicker.getPictures(options)
              .then(function (results) {
                  for (var i = 0; i < results.length; i++)
                  {
                      console.log('Image URI: ' + results[i]);
                  }
              }, function (error) {
                  // error getting photos
                  // if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                  CommonServices.logOut();
              });

        });
    };


    $scope.takePhoto = function () {
        console.log($cordovaCamera);

        $ionicPlatform.ready(function () {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (imageData) {
                console.log(imageData);
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
                var binary_string = window.atob(imageData);
                var len = binary_string.length;
                var bytes = new Uint8Array(len);
                for (var i = 0; i < len; i++)
                {
                    bytes[i] = binary_string.charCodeAt(i);
                }
                $scope.picture = imageData;
                console.log(bytes);
            }, function (err) {
                // An error occured. Show a message to the user
            });
        });
    }


    $scope.choosePhoto = function () {
        $ionicPlatform.ready(function () {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (imageData) {
                console.log(imageData);
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
            }, function (err) {
                // An error occured. Show a message to the user
            });
        });
    }



    $scope.GoBack = function () {
        $ionicHistory.goBack();
        //$state.go('app.selectRecipient');
    }
})
