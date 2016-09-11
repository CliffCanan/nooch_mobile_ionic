angular.module('noochApp.howMuchCtrl', ['ngCordova', 'noochApp.howMuch-service', 'noochApp.services'])

.controller('howMuchCtrl', function ($scope, $state, $ionicPlatform, $ionicHistory, $stateParams, $ionicModal, howMuchService, $localStorage, $ionicPopup, CommonServices, ValidatePin, $ionicLoading, $ionicContentBanner, $cordovaCamera, $cordovaImagePicker, $ionicActionSheet) {

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


    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        console.log('HowMuchCntrl Fired');

        $scope.requestSelected = false;
        $scope.sendSelected = false;

        console.log($stateParams);

        if (typeof $stateParams.recip == 'object')
        {
            if ($stateParams.recip == null)
                $state.go('app.selectRecipient');

            $scope.recipientDetail = $stateParams.recip;
        }
        else if (isNaN($stateParams.recip)) // email
        {
            $scope.recipientDetail.UserName = $stateParams.recip;
            $scope.recipientDetail.Photo = "././img/profile_picture.png";
        }
        else if (!isNaN($stateParams.recip))
        {
            $scope.recipientDetail.ContactNumber = $stateParams.recip;
            $scope.recipientDetail.Photo = "././img/profile_picture.png";
        }

        console.log($stateParams.recip);

        $('#howMuchForm').parsley();

        $(".amount-container input").focus();
    });


    $(".amount-container input").focusout(function () {
        console.log($scope.recipientDetail.Amount);

        var enteredAmnt = $scope.recipientDetail.Amount;

        if (typeof enteredAmnt != "undefined" && enteredAmnt.length > 0)
        {
            console.log("enteredAmnt > 0");

            //if ($('#howMuchForm').parsley().validate() != true){
            //	console.log("howMuchForm NOT VALID");
            //    $(this).focus();
            //}
            //else
            //{
            //console.log("howMuchForm VALID");
            if (enteredAmnt.indexOf(".") == -1)
            {
                console.log(". was missing");
                $scope.recipientDetail.Amount = enteredAmnt + ".00";
            }
            else if (enteredAmnt.indexOf(".") > enteredAmnt.length - 3)
            {
                console.log("2nd one");
                $scope.recipientDetail.Amount = enteredAmnt + "0";
            }

            //console.log($('#howMuchForm').parsley().validate());
        }
    });


    $scope.submitRequest = function () {
        type = 'request';
        $scope.sendSelected = false;

        console.log($('#howMuchForm').parsley().validate());
		
        if ($scope.requestSelected == true)
        {
            CommonServices.savePinValidationScreenData({ myParam: $scope.requestData, type: 'request', returnUrl: 'app.howMuch', returnPage: 'How Much', comingFrom: 'Request' });

            $state.go('enterPin');
        }
        // else if ($('#howMuchForm').parsley().validate() == true)
        else if (typeof $scope.recipientDetail.Amount != "undefined" &&
            $scope.recipientDetail.Amount >= 1 &&
            $scope.recipientDetail.Amount <= 5000)
        {
            console.log($scope.requestData);

            $scope.requestData.Photo = $scope.recipientDetail.Photo;
            $scope.requestData.MemberId = $localStorage.GLOBAL_VARIABLES.MemberId;
            $scope.requestData.Amount = $scope.recipientDetail.Amount;
            $scope.requestData.SenderId = $scope.recipientDetail.MemberId;
            if ($scope.recipientDetail.FirstName != undefined && $scope.recipientDetail.FirstName != "")
            {
                $scope.requestData.Name = $scope.recipientDetail.FirstName
                if ($scope.recipientDetail.LastName != undefined && $scope.recipientDetail.LastName != "")
                    $scope.requestData.Name += ' ' + $scope.recipientDetail.LastName;
            }
            else
                $scope.requestData.Name = "";
            $scope.requestData.RecepientName = $scope.requestData.Name;
            $scope.requestData.Memo = $scope.recipientDetail.Memo;
            $scope.requestData.Picture = $scope.picture;
            $scope.requestData.MoneySenderEmailId = $scope.recipientDetail.UserName;
            $scope.requestData.contactNumber = $scope.recipientDetail.ContactNumber;
            if ($scope.requestData.RecepientName.replace(/\s/g, "") == "")
                $scope.requestData.RecepientName = $scope.requestData.MoneySenderEmailId ? $scope.requestData.MoneySenderEmailId
                                                                                         : $scope.requestData.contactNumber;

            // $("#sendBtn").addClass("shrink");
            // $("#requestBtn").addClass("expand");

            $scope.requestSelected = true;

            console.log($scope.requestData);
        }
    };


    $scope.submitSend = function () {
        $scope.requestSelected = false;

        type = 'send';

        console.log('SubmitSend() Fired -> Amount: ' + $scope.recipientDetail.Amount);

        if ($scope.sendSelected == true)
        {
            CommonServices.savePinValidationScreenData({ myParam: $scope.sendData, type: 'transfer', returnUrl: 'app.howMuch', returnPage: 'How Much', comingFrom: 'Transfer' });

            $state.go('enterPin');
        }
        else if ($scope.recipientDetail.Amount < 5000)
        {
            console.log($scope.recipientDetail);

            $scope.sendData.MemberId = $localStorage.GLOBAL_VARIABLES.MemberId;
            $scope.sendData.Amount = $scope.recipientDetail.Amount;
            $scope.sendData.RecepientId = $scope.recipientDetail.MemberId;
            if ($scope.recipientDetail.FirstName != undefined && $scope.recipientDetail.FirstName != "")
            {
                $scope.sendData.Name = $scope.recipientDetail.FirstName
                if ($scope.recipientDetail.LastName != undefined && $scope.recipientDetail.LastName != "")
                    $scope.sendData.Name += ' ' + $scope.recipientDetail.LastName;
            }
            else
                $scope.sendData.Name = "";
            $scope.sendData.RecepientName = $scope.sendData.Name;
            $scope.sendData.Memo = $scope.recipientDetail.Memo;
            $scope.sendData.Picture = $scope.picture;
            $scope.sendData.Photo = $scope.recipientDetail.Photo;
            $scope.sendData.UserName = $scope.recipientDetail.UserName;
            $scope.sendData.InvitationSentTo = $scope.recipientDetail.UserName;
            $scope.sendData.PhoneNumberInvited = $scope.recipientDetail.ContactNumber;
            $scope.sendData.contactNumber = $scope.recipientDetail.ContactNumber;
            if ($scope.sendData.RecepientName.replace(/\s/g, "") == "")
                $scope.sendData.RecepientName = $scope.sendData.UserName ? $scope.sendData.UserName
                                                                         : $scope.sendData.PhoneNumberInvited;

            console.log($scope.sendData);

            $scope.sendSelected = true;
        }
    }


    $scope.resetBtns = function () {
        $scope.requestSelected = false;
        $scope.sendSelected = false;
    }


    $scope.checkAmount = function () {
        //console.log(typeof $scope.recipientDetail.Amount);

        if (typeof $scope.recipientDetail.Amount != "undefined")
        {
            console.log($scope.recipientDetail.Amount);

            var currentVal = $scope.recipientDetail.Amount;

            if (currentVal > 5000)
            {
                $scope.recipientDetail.Amount = 5000;

                $ionicContentBanner.show({
                    text: ['The max transfer amount is currently $5,000.'],
                    autoClose: 4000,
                    type: 'error',
                    transition: 'vertical'
                });
            }
            // if (currentVal < 5)
            // 		{
            // 			//$scope.recipientDetail.Amount = 5000;
            //
            //             $ionicContentBanner.show({
            //                 text: ['The minimum transfer amount is currently $5.'],
            // 				autoClose: 4000,
            //                 type: 'error',
            //                 transition: 'vertical'
            //             });
            // 		}
        }
    }


    $scope.addImage = function () {

        $ionicPlatform.ready(function () {

            var options = {
                maximumImagesCount: 0,
                width: 500,
                height: 500,
                quality: 80
            };

            $cordovaImagePicker.getPictures(options)
              .then(function (results) {
                  for (var i = 0; i < results.length; i++)
                  {
                      console.log('Image URI: ' + results[i]);
                  }
              }, function (error) {
                  // error getting photos
                  // if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
                  CommonServices.logOut();
              });
        });
    };


    $scope.changePic = function () {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: 'From Device Photos' },
              { text: 'Use Camera' }
            ],
            titleText: 'Attach a Picture',
            cancelText: 'Cancel',
            buttonClicked: function (index) {
                if (index == 0) $scope.choosePhoto();
                else if (index == 1) $scope.takePhoto();

                return true;
            }
        });
    }


    $scope.takePhoto = function () {
        console.log($cordovaCamera);

        cordova.plugins.diagnostic.isCameraAuthorized(function (authorized) {

            console.log("App is " + (authorized ? "authorized" : "denied") + " access to the camera");

            if (authorized)
            {
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
            }
            else
            {
                swal({
                    title: "Allow Camera Access",
                    text: "Do you want to take a picture to attach to this payment?",
                    type: "info",
                    confirmButtonText: "Yes",
                    confirmButtonColor: "#3fabe1",
                    showCancelButton: true,
                    cancelButtonText: "Not Now"
                }, function (isConfirm) {
                    if (isConfirm)
                    {
                        cordova.plugins.diagnostic.requestCameraAuthorization(function (status) {
                            console.log("Authorization request for camera use was: [" + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted]" : "denied]"));
                            if (status)
                                $scope.takePhoto();
                        }, function (error) {
                            console.error(error);
                        });
                    }
                });
            }
        }, function (error) {
            console.error("The following error occurred: " + error);
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
    }
})
