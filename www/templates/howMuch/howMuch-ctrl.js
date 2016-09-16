angular.module('noochApp.howMuchCtrl', ['ngCordova', 'noochApp.howMuch-service', 'noochApp.services'])

.controller('howMuchCtrl', function ($scope, $state, $ionicPlatform, $ionicHistory, $stateParams, $ionicModal,
			howMuchService, $localStorage, $ionicPopup, CommonServices, ValidatePin, $ionicLoading,
			$ionicContentBanner, $cordovaCamera, $cordovaImagePicker, $ionicActionSheet, $cordovaGoogleAnalytics, $timeout) {

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

        //console.log($stateParams.recip);

        if (typeof $stateParams.recip == 'object')
        {
            console.log('object');
            if ($stateParams.recip == null) $state.go('app.selectRecipient');

            else if (typeof $stateParams.recip.type != "undefined")
            {
                if (typeof $stateParams.recip.value != "undefined")
                {
                    // We know this is a non-Nooch user manually entered from the Select Recipient scrn (NOT a phone contact or from Home scrn)

                    $scope.recipientDetail.Photo = $stateParams.recip.photo;

                    if ($stateParams.recip.type == "phone")
                        $scope.recipientDetail.ContactNumber = $stateParams.recip.value;
                    else
                        $scope.recipientDetail.UserName = $stateParams.recip.value;
                }
                else
                    $state.go('app.selectRecipient');
            }
            else // Must be an existing user
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

        if ($('#amountField').hasClass('parsley-error')) $('#amountField').removeClass('parsley-error');

        console.log($scope.recipientDetail);
    });


    $scope.$on('$ionicView.afterEnter', function () {
        $("#amountField").focus();

        $ionicPlatform.ready(function () {
            if (typeof analytics !== 'undefined') analytics.trackView("How Much");
        })
    });


    $scope.formatAmount = function () {
        //console.log($scope.recipientDetail.Amount);

        if ($('#amountField').hasClass('parsley-error')) $('#amountField').removeClass('parsley-error');

        var enteredAmnt = $scope.recipientDetail.Amount;

        if (typeof $scope.recipientDetail.Amount != "undefined" && enteredAmnt.length > 0)
        {
            // Strip out all non-digits
            enteredAmnt = enteredAmnt.replace(/\D/ig, '');

            if (enteredAmnt.length > 7)
            {
                enteredAmnt = enteredAmnt.slice(0, -1);
            }
            else if (enteredAmnt.length > 5)
            {
                enteredAmnt = enteredAmnt.slice(0, 1) + "," + enteredAmnt.slice(1, -2) + "." + enteredAmnt.slice(-2); // "0,000.00"
            }
            else if (enteredAmnt.length > 2)
            {
                enteredAmnt = enteredAmnt.slice(0, -2) + "." + enteredAmnt.slice(-2); // "000.00"
            }
            else if (enteredAmnt.length == 1)
            {
                enteredAmnt = ".0" + enteredAmnt; // ".00"
            }

            if (enteredAmnt.slice(0, 1) == "0") enteredAmnt = enteredAmnt.slice(1);

            $scope.recipientDetail.Amount = enteredAmnt;


            if (parseFloat(enteredAmnt.replace(',', '')) > 5000)
            {
                $scope.recipientDetail.Amount = '5,000.00';

                $ionicContentBanner.show({
                    text: ['The max transfer amount is currently $5,000.'],
                    autoClose: 4000,
                    type: 'error',
                    transition: 'vertical'
                });
            }
        }
    };


    $scope.submitRequest = function () {
        type = 'request';
        $scope.sendSelected = false;

        // console.log($scope.recipientDetail);

        if ($scope.requestSelected == true)
        {
            // 2nd Tap on Request Btn
            CommonServices.savePinValidationScreenData({ transObj: $scope.requestData, type: 'request', returnUrl: 'app.howMuch', returnPage: 'How Much', comingFrom: 'Request' });

            $state.go('enterPin');
        }
        else if (typeof $scope.recipientDetail.Amount == "undefined" || parseFloat($scope.recipientDetail.Amount) == 0)
        {
            $scope.noAmountAlert('request');
        }
        else if (parseFloat($scope.recipientDetail.Amount.replace(',', '')) < 1)
        {
            $scope.underTransLimitAlert('request');
        }
        else if (parseFloat($scope.recipientDetail.Amount.replace(',', '')) > 2000)
        {
            $scope.overTransLimitAlert('request');
        }
        else
        {
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
            $scope.requestData.Picture = $scope.pictureBase64;
            $scope.requestData.MoneySenderEmailId = $scope.recipientDetail.UserName;
            $scope.requestData.contactNumber = $scope.recipientDetail.ContactNumber;
            if ($scope.requestData.RecepientName.replace(/\s/g, "") == "")
                $scope.requestData.RecepientName = $scope.requestData.MoneySenderEmailId ? $scope.requestData.MoneySenderEmailId
                                                                                         : $scope.requestData.contactNumber;

            $scope.requestSelected = true;

            console.log($scope.requestData);
        }
    };


    $scope.submitSend = function () {
        type = 'send';
        $scope.requestSelected = false;

        // console.log($scope.recipientDetail);

        if ($scope.sendSelected == true)
        {
            // 2nd Tap on Send Btn
            CommonServices.savePinValidationScreenData({ transObj: $scope.sendData, type: 'transfer', returnUrl: 'app.howMuch', returnPage: 'How Much', comingFrom: 'Transfer' });

            $state.go('enterPin');
        }
        else if (typeof $scope.recipientDetail.Amount == "undefined" || $scope.recipientDetail.Amount == 0)
        {
            $scope.noAmountAlert('send');
        }
        else if (parseFloat($scope.recipientDetail.Amount.replace(',', '')) < 1)
        {
            $scope.underTransLimitAlert('send');
        }
        else if (parseFloat($scope.recipientDetail.Amount.replace(',', '')) > 2000)
        {
            $scope.overTransLimitAlert('send');
        }
        else
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
            $scope.sendData.Picture = $scope.pictureBase64;
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


    $scope.noAmountAlert = function (type) {

        $('#amountField').addClass('parsley-error');

        var firstName = typeof $scope.recipientDetail.FirstName != "undefined"
			? $scope.recipientDetail.FirstName
			: $scope.recipientDetail.UserName;

        var bodyTxt = type == "send"
			? "We'd love to send a $0 payment to " + firstName + ", but it's actually surprisingly tricky.<span class='show'>Please enter an amount > $1.00</span>"
			: "We'd love to send a $0 request to " + firstName + ", but it would just get too confusing for everyone.<span class='show'>Please enter an amount > $1.00</span>";

        swal({
            title: "Non-cents!",
            text: bodyTxt,
            type: "warning",
            confirmButtonColor: "#3fabe1",
            customClass: "heavierText",
            html: true
        }, function () {
            $timeout(function () {
                $("#amountField").focus();
            }, 800);
        });
    }


    $scope.overTransLimitAlert = function (type) {

        $('#amountField').addClass('parsley-error');

        var bodyTxt = type == "send"
			? "To keep Nooch safe, please don’t send more than $2,000. We hope to raise this limit very soon!"
			: "We love your enthusiasm, but currently transfers are limited to $2,000 to minimize our risk (and yours). We're working to raise the limit soon!";

        swal({
            title: "Whoa Now",
            text: bodyTxt,
            type: "warning",
            confirmButtonColor: "#3fabe1",
            customClass: "heavierText"
        }, function () {
            $timeout(function () {
                $("#amountField").focus();
            }, 800);
        });
    }


    $scope.underTransLimitAlert = function (type) {

        $('#amountField').addClass('parsley-error');

        var firstName = typeof $scope.recipientDetail.FirstName != "undefined"
			? $scope.recipientDetail.FirstName
			: "no name";

        var bodyTxt = "";
        if (type == "send")
        {
            bodyTxt = firstName === "no name"
				? "Surely you need to send more than that!<span class='show'>Please enter an amount > $1.00.</span>"
				: "Surely you need to pay " + firstName + " more than that!<span class='show'>Please enter an amount > $1.00.</span>";
        }
        else
        {
            bodyTxt = firstName === "no name"
				? "Surely you need to collect more than that!<span class='show'>Please enter an amount > $1.00.</span>"
				: "Surely " + firstName + " owes you more than that!<span class='show'>Please enter an amount > $1.00.</span>";
        }

        swal({
            title: "Almost There...",
            text: bodyTxt,
            type: "warning",
            confirmButtonColor: "#3fabe1",
            customClass: "heavierText",
            html: true
        }, function () {
            $timeout(function () {
                $("#amountField").focus();
            }, 800);
        });
    }


    $scope.changePic = function () {

        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: 'From Photo Library' },
              { text: 'Use Camera' }
            ],
            titleText: 'Attach a Picture',
            cancelText: 'Cancel',
            destructiveText: $scope.isPicAttachedToTrans == true ? 'Remove Picture' : null,
            buttonClicked: function (index) {
                if (index == 0)
                    $scope.choosePhotoFromDevice();
                else if (index == 1)
                    $scope.takePhoto();

                return true;
            },
            destructiveButtonClicked: function () {
                $scope.pictureBase64 = null;
                $scope.imgURI = null;
                $scope.isPicAttachedToTrans = false;
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
                    quality: 80,
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
                    $scope.pictureBase64 = "data:image/jpeg;base64," + imageData; // This is for displaying on the How Much screen
                    $scope.imgURI = imageData; // This goes to the server
                    $scope.isPicAttachedToTrans = true;
                }, function (err) {
                    $scope.pictureBase64 = null;
                    $scope.imgURI = null;
                    $scope.isPicAttachedToTrans = false;

                    $scope.showErrorBanner('camera');
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
                            $scope.showErrorBanner('camera');
                        });
                    }
                });
            }
        }, function (error) {
            console.error("isCameraAuthorized error: [" + error + "]");
            $scope.showErrorBanner('camera');
        });
    }


    $scope.choosePhotoFromDevice = function () {
        // CC (9/15/16): Apparently isCameraRollAuthorized() is only for iOS... so need to check to see which platform the user is on.

        $ionicPlatform.ready(function () {
            CommonServices.openPhotoGallery('howMuch', function (result) {
                if (result != null && result != 'failed')
                {
                    $scope.pictureBase64 = "data:image/jpeg;base64," + result;
                    $scope.imgURI = result;

                    $scope.isPicAttachedToTrans = true;
                }
                else
                {
                    console.log("ADD - PICTURE - failure FROM COMMONSERVICES [" + result + "]");
                    $scope.pictureBase64 = null;
                    $scope.imgURI = null;
                    $scope.isPicAttachedToTrans = false;

                    $scope.showErrorBanner('photo gallery');
                }
            });
        });
    }


    $scope.showErrorBanner = function (id) {
        $ionicContentBanner.show({
            text: ['Error - Unable to get picture from the ' + id + ' :-('],
            autoClose: 4000,
            type: 'error',
            transition: 'vertical'
        });
    }


    $scope.GoBack = function () {
        $ionicHistory.goBack();
    }

})
