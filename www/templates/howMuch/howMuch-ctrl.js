﻿angular.module('noochApp.howMuchCtrl', ['ngCordova', 'noochApp.howMuch-service', 'noochApp.services'])

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
        "isRentPayment": "",
        "contactNumber": "",
        "RecepientName": null,
        "Photo": "",
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
        "Name": "",
        "RecepientName": null,
        "Memo": "",
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
        "FirstName": "",
        "LastName": "",
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
        "cip": null,
        "contactNumber": null
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

        if (typeof $stateParams.recip == 'object')
        {
            if ($stateParams.recip == null)
                $state.go('app.selectRecipient');

            $scope.recipientDetail = $stateParams.recip;
        }
        else if (isNaN($stateParams.recip)) //'mail'
            $scope.recipientDetail.UserName = $stateParams.recip;
        else if (!isNaN($stateParams.recip))
            $scope.recipientDetail.ContactNumber = $stateParams.recip;

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
            console.log($scope.requestData);

            $scope.requestData.Photo = $scope.recipientDetail.Photo;
            $scope.requestData.MemberId = $localStorage.GLOBAL_VARIABLES.MemberId;
            $scope.requestData.Amount = $scope.recipientDetail.Amount;
            $scope.requestData.SenderId = $scope.recipientDetail.MemberId;
            if ($scope.recipientDetail.FirstName != undefined)
                $scope.requestData.Name = $scope.recipientDetail.FirstName + ' ' + $scope.recipientDetail.LastName;
            $scope.requestData.RecepientName = $scope.requestData.Name;
            $scope.requestData.Memo = $scope.recipientDetail.Memo;
            $scope.requestData.Picture = $scope.picture;
            $scope.requestData.MoneySenderEmailId = $scope.recipientDetail.UserName;
            $scope.requestData.contactNumber = $scope.recipientDetail.ContactNumber;
            if ($scope.requestData.RecepientName.replace(/\s/g, "") == "")
                $scope.requestData.RecepientName = $scope.requestData.MoneySenderEmailId ? $scope.requestData.MoneySenderEmailId
                                                                                         : $scope.requestData.contactNumber;

            CommonServices.savePinValidationScreenData({ myParam: $scope.requestData, type: 'request', returnUrl: 'app.howMuch', returnPage: 'How Much', comingFrom: 'Request' });

            $state.go('enterPin');
        }
    };


    $scope.submitSend = function () {
        type = 'send';

        if ($('#howMuchForm').parsley().validate() == true)
        {
            console.log($scope.recipientDetail);

            $scope.sendData.MemberId = $localStorage.GLOBAL_VARIABLES.MemberId;
            $scope.sendData.Amount = $scope.recipientDetail.Amount;
            $scope.sendData.RecepientId = $scope.recipientDetail.MemberId;
            if ($scope.recipientDetail.FirstName != undefined && $scope.recipientDetail.FirstName != "")
                $scope.sendData.RecepientName = $scope.recipientDetail.FirstName + ' ' + $scope.recipientDetail.LastName;
            else
                $scope.sendData.RecepientName = "";
            $scope.sendData.Memo = $scope.recipientDetail.Memo;
            $scope.sendData.Picture = $scope.picture;
            $scope.sendData.Photo = $scope.recipientDetail.Photo;

            $scope.sendData.UserName = $scope.recipientDetail.UserName;
            $scope.sendData.InvitationSentTo = $scope.recipientDetail.UserName;
            $scope.sendData.PhoneNumberInvited = $scope.recipientDetail.ContactNumber;
            console.log($scope.sendData);

            if ($scope.sendData.RecepientName.replace(/\s/g, "") == "")
                $scope.sendData.RecepientName = $scope.sendData.UserName ? $scope.sendData.UserName
                                                                         : $scope.sendData.PhoneNumberInvited;

            CommonServices.savePinValidationScreenData({ myParam: $scope.sendData, type: 'transfer', returnUrl: 'app.howMuch', returnPage: 'How Much', comingFrom: 'Transfer' });

            $state.go('enterPin');
        }
    }


 



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
