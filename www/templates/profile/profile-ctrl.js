angular.module('noochApp.profileCtrl', ['noochApp.profile-service', 'noochApp.services', 'ngCordova'])
.controller('profileCtrl', function ($scope, CommonServices, profileService, $state, $ionicHistory, $localStorage,
                                     $cordovaNetwork, $ionicLoading, $cordovaDatePicker, $cordovaImagePicker, $ionicPlatform,
                                     $cordovaCamera, $ionicContentBanner, $rootScope, $ionicActionSheet, $timeout) {


    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        $scope.isAnythingChanged = false;

        $scope.Details = {
            Photo: $rootScope.profilePicUrl != null ? $rootScope.profilePicUrl : '././img/profile_picture.png',
            ContactNumber: $rootScope.contactNumber != null ? $rootScope.contactNumber : ''
        }

        $scope.MemberDetails();
    });


    $scope.$on("$ionicView.enter", function (event, data) {
        //console.log('Profile Page Loadad');

        $scope.shouldGoToSettings = false;
        $scope.shouldDisplayErrorBanner = false;
        $scope.errorBannerTextArray = [];

        if ($localStorage.GLOBAL_VARIABLES.Status === "Suspended" ||
            $localStorage.GLOBAL_VARIABLES.Status === "Temporarily_Blocked")
        {
            $scope.errorBannerTextArray.push('ACCOUNT SUSPENDED');
            $scope.shouldDisplayErrorBanner = true;
        }

        if ($localStorage.GLOBAL_VARIABLES.hasSynapseBank != true)
        {
            $scope.errorBannerTextArray.push('ACTION REQUIRED: Missing Bank Account');
            $scope.shouldDisplayErrorBanner = true;
        }

        if ($scope.shouldDisplayErrorBanner)
        {
            $ionicContentBanner.show({
                text: $scope.errorBannerTextArray,
                interval: '4000',
                type: 'error',
                icon: 'ion-close-circled'
            });

            $scope.isBannerShowing = true;
        }
        else
            $scope.isBannerShowing = false;


        $ionicPlatform.ready(function () {
            if (typeof analytics !== 'undefined') analytics.trackView("Profile");
        })
    })


    //$scope.$on("$ionicView.afterEnter", function (event, data) {
    //});


    $scope.MemberDetails = function () {
        //console.log('MemberDetails Function Fired');
        try
        {
            //if ($cordovaNetwork.isOnline())
            //{
            $ionicLoading.show({
                template: 'Loading Profile'
            });

            profileService.GetMyDetails()
                .success(function (details) {
                    console.log(details);

                    $scope.Details = details;

                    if (details.DateOfBirth != null && details.DateOfBirth.length > 0)
                        $scope.Details.DateOfBirth = new Date(details.DateOfBirth);

                    $ionicLoading.hide();
                })
                .error(function (error) {
                    console.log('GetMyDetails Error: [' + JSON.stringify(error) + ']');
                    $ionicLoading.hide();

                    if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
                        CommonServices.logOut();
                    else
                        CommonServices.DisplayError('Unable to get profile details :-(');
                })
            //}
            //else
            //    swal("Error", "Internet not connected!", "error");
        }
        catch (e)
        {
            console.log(e);
        }
    }


    $scope.UpdateProfile = function () {
        //console.log('Update Profile Function Fired');
        //console.log($('#profileForm').parsley().validate());

        if ($('#profileForm').parsley().validate() == true)
        {
            var tempContNum = $scope.Details.ContactNumber.replace(/[()-\s]/g, '');
            if (tempContNum != null && tempContNum.length != 10 && !$rootScope.IsPhoneVerified)
            {
                swal({
                    title: "Phone Number Trouble",
                    text: "Please double check that you entered a valid 10-digit phone number.",
                    type: "warning",
                    customClass: "singleBtn heavierText"
                });
            }
            else
            {
                //if ($cordovaNetwork.isOnline()) {
                $ionicLoading.show({
                    template: 'Saving Profile...'
                });

                //$scope.Details.ContactNumber = $scope.Details.ContactNumber.replace(/[()-\s]/g, '');
                console.log($scope.Details);

                profileService.UpdateProfile($scope.Details)
	                .success(function (data) {
	                    console.log(data);

	                    $ionicLoading.hide();

	                    if (data.Result.indexOf('success') > -1)
	                    {
	                        $ionicContentBanner.show({
	                            text: ['Profile Updated Successfully!'],
	                            autoClose: '4000',
	                            type: 'success',
	                            transition: 'vertical',
	                            cancelOnStateChange: false,
	                            icon: 'ion-close-circled'
	                        });

	                        if ($scope.Details.SSN != null)
	                            $scope.saveSSN($scope.Details);

	                        $scope.isAnythingChanged = false;

	                        $timeout(function () {
	                            if ($scope.shouldGoToSettings)
	                                $state.go('app.settings');

	                            // CC (9/18/16): This was reloading the screen, but since the changes are already on the screen, why
	                            // bother to reload?  It's closing the Success Banner anyway, so commenting this out for now.
	                            //else
	                            //    $state.reload();
	                        }, 2000);
	                    }
	                    else if (data.Result.indexOf('Phone Number already registered with Nooch') > -1)
	                    {
	                        CommonServices.DisplayError('Phone # already registered to another user!');
	                    }
	                    else
	                        CommonServices.DisplayError('Profile not updated :-(');
	                })
	                .error(function (error) {
	                    console.log('UpdateProfile Error: [' + JSON.stringify(error) + ']');

	                    $ionicLoading.hide();

	                    if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
	                        CommonServices.logOut();
	                    else
	                        CommonServices.DisplayError('Unable to save profile changes :-(');
	                })
                //}
                //else
                //    swal("Error", "Internet not connected!", "error");
            }
        }
    }


    $scope.ResendVerificationLink = function () {
        swal({
            title: "Resend Confirmation Link?",
            text: "Your email address <strong>(" + $scope.Details.UserName + ")</strong> is unverified." +
                  "<span class='show'>Would you like us to re-send a verification link now?</span>",
            type: "warning",
            showCancelButton: true,
            cancelButtonText: "Not Now",
            confirmButtonText: "Yes",
            html: true
        }, function (isConfirm) {
            if (isConfirm)
            {
                $ionicLoading.show({
                    template: 'Sending Verification Link...'
                });

                CommonServices.ResendVerificationLink()
                   .success(function (result) {
                       $ionicLoading.hide();

                       if (result.Result == 'Success')
                           $ionicContentBanner.show({
                               text: ['Verification link sent to: ' + $rootScope.emailAddress],
                               autoClose: '5000',
                               type: 'success',
                               transition: 'vertical',
                               icon: 'ion-close-circled'
                           });
                       else
                           CommonServices.DisplayError('Email verification link not sent :-(');
                   })
				   .error(function (error) {
				       console.log('ResendVerificationLink Error: [' + JSON.stringify(error) + ']');

				       if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
				           CommonServices.logOut();
				       else
				           CommonServices.DisplayError('Email verification link not sent :-(');
				   });
            }
        });
    }


    $scope.ResendVerificationSMS = function () {

        swal({
            title: "Resend Confirmation SMS?",
            text: "<strong style='color:#888'>" + $rootScope.contactNumber + "</strong><span class='show'>Your phone number is unverified.</span>" +
                  "<span class='show'>Would you like us to re-send a verification text message now?</span>",
            type: "warning",
            showCancelButton: true,
            cancelButtonText: "Not Now",
            confirmButtonText: "Yes",
            html: true
        }, function (isConfirm) {
            if (isConfirm)
            {
                $ionicLoading.show({
                    template: 'Sending Verification Text...'
                });

                CommonServices.ResendVerificationSMS()
                   .success(function (result) {
                       console.log(result);
                       $ionicLoading.hide();

                       if (result.Result == 'Success')
                           swal({
                               title: "Check Your Messages",
                               text: "We just sent a text message to <span class='show f-600'>" + $rootScope.contactNumber +
                                     "</span><span class='show'>Please respond <strong>\"Go\"</strong> to confirm your number (case doesn't matter).</span>",
                               type: "success",
                               html: true,
                               customClass: "singleBtn"
                           });
                       else if (result.Result == 'Already Verified')
                           swal({
                               title: "You're Good To Go",
                               text: "Your phone number has already been verified.",
                               type: "success",
                               customClass: "singleBtn heavierText"
                           })
                       else
                           CommonServices.DisplayError('Verification SMS Not Sent :-(');
                   })
				   .error(function (error) {
				       $ionicLoading.hide();
				       console.log('ResendVerificationSMS Error: [' + JSON.stringify(error) + ']');

				       if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
				           CommonServices.logOut();
				       else
				           CommonServices.DisplayError('Verification SMS Not Sent :-(');
				   })
            }
        });
    }


    // Date Picker Plugin
    // CC (9/15/16): Don't think this is used.
    $scope.showdate = function () {

        var options = {
            date: new Date(),
            mode: 'date', // or 'time'
            minDate: 0,
            maxDate: new Date('01/01/1998'),
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#3fabe1',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#222'
        };

        document.addEventListener("deviceready", function () {

            $cordovaDatePicker.show(options).then(function (date) {
                $scope.Details.DateOfBirth = date;
                if ($scope.Details.DateOfBirth != null)
                {
                    //$scope.Details.DateOfBirth = new Date($scope.Details.DateOfBirth);
                    console.log('From DatePicker: [' + $scope.Details.DateOfBirth + ']');
                }
            });
        }, false);
    }


    $scope.changePic = function () {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
				{ text: 'Choose From Library' },
				{ text: 'Take Photo' }

            ],
            titleText: 'Update Your Profile Picture',
            cancelText: 'Cancel',
            buttonClicked: function (index) {
                if (index == 0)
                    $scope.choosePhotoFromDevice();
                else if (index == 1)
                    $scope.takePhoto();
                return true;
            }
        });
    }


    $scope.choosePhotoFromDevice = function () {
        $ionicPlatform.ready(function () {
            CommonServices.openPhotoGallery('profile', function (result) {
                if (result != null && result != 'failed' && result != 'no image selected')
                {
                    $scope.Details.Photo = "data:image/jpeg;base64," + result;
                    $scope.Details.Photos = result;
                    $scope.isAnythingChanged = true;
                }
                else
                {
                    $scope.pictureBase64 = null;
                    $scope.isPicAttachedToTrans = false;
                    if (result != null && result == 'failed')
                        CommonServices.DisplayError('Unable to access photo gallery :-(');
                }
            });
        });
    }


    $scope.takePhoto = function () {

        $ionicPlatform.ready(function () {
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
                        //console.log(imageData);
                        $scope.Details.Photo = "data:image/jpeg;base64," + imageData;
                        $scope.Details.Photos = imageData;
                        $scope.isAnythingChanged = true;
                    }, function (error) {
                        //CommonServices.DisplayError('Unable to access the camera :-(');
                        console.log(error);
                    });
                }
                else
                {
                    swal({
                        title: "Allow Camera Access",
                        text: "This lets you take a picture to use for your profile.",
                        type: "info",
                        confirmButtonText: "Give Access",
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
                                console.log(error);
                                //CommonServices.DisplayError('Unable to access the camera :-(');
                            });
                        }
                    });
                }
            }, function (error) {
                console.error("isCameraAuthorized Error: [" + error + ']');
                CommonServices.DisplayError('Unable to access the camera :-(');
            });
        });
    }


    $scope.saveSSN = function (Details) {
        console.log('saveSSN Function Fired');
        var tempSSN = $scope.Details.SSN.replace(/-/g, '');

        profileService.SaveMemberSSN(tempSSN)
            .success(function (details) {
                //console.log(details);

                if (details == null || details.Result != 'SSN saved successfully.')
                    CommonServices.DisplayError('Unable to save SSN :-(');
            })
			.error(function (error) {
			    console.log('SaveMemberSSN Error: [' + JSON.stringify(error) + ']');

			    if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
			        CommonServices.logOut();
			    else
			        CommonServices.DisplayError('Unable to save SSN :-(');
			})
    }


    $scope.isAnythingChange = function () {
        $scope.isAnythingChanged = true;
    }


    $scope.goToSettings = function () {
        if ($scope.isAnythingChanged == true)
        {
            swal({
                title: "Save Changes?",
                text: "Would you like to save the changes to your profile?",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "Not Now",
                confirmButtonText: "Yes - Save"
            }, function (isConfirm) {
                if (isConfirm)
                {
                    $scope.shouldGoToSettings = true;
                    $scope.UpdateProfile()
                }
                else
                    $state.go('app.settings');
            });
        }
        else
            $state.go('app.settings');
    }


    $scope.checkLength = function (value) {
        // console.log(value);

        if (value == "zip")
        {
            // Strip out all non-digits
            $scope.Details.Zipcode = $scope.Details.Zipcode.replace(/\D/g, '');

            if ($scope.Details.Zipcode.length > 5)
                $scope.Details.Zipcode = $scope.Details.Zipcode.slice(0, -1);
        }
        else if (value == "phone")
        {
            // Strip out any letters
            $scope.Details.ContactNumber = $scope.Details.ContactNumber.replace(/[a-z]/ig, '')

            var lastCharEntered = $scope.Details.ContactNumber.slice(-1);

            if (lastCharEntered.replace(/\D/, '').length == 0 || $scope.Details.ContactNumber.length > 14)
                $scope.Details.ContactNumber = $scope.Details.ContactNumber.slice(0, -1);
            else if ($scope.Details.ContactNumber.length > 7)
                $scope.Details.ContactNumber = $scope.Details.ContactNumber.replace(/^\((\d{3})\)\s(\d{3})(\d{1})/, '($1) $2-$3'); //"(XXX) XXX-XXXX",
            else if ($scope.Details.ContactNumber.length > 3)
                $scope.Details.ContactNumber = $scope.Details.ContactNumber.replace(/^\(?(\d{3})(\d{1})/, '($1) $2'); //"(XXX) X",
        }
        else if (value == "ssn")
        {
            // Strip out any letters
            $scope.Details.SSN = $scope.Details.SSN.replace(/[a-z]/ig, '')

            var lastCharEntered = $scope.Details.SSN.slice(-1);

            // If the last char entered was a non-digit, or if already at 11 chars, delete the character
            if (lastCharEntered.replace(/\D/, '').length == 0 || $scope.Details.SSN.length > 11)
                $scope.Details.SSN = $scope.Details.SSN.slice(0, -1);
            else if ($scope.Details.SSN.length > 6)
                $scope.Details.SSN = $scope.Details.SSN.replace(/^(\d{3})-(\d{2})(\d{1})/, '$1-$2-$3'); //XXX-XX-X
            else if ($scope.Details.SSN.length > 3)
                $scope.Details.SSN = $scope.Details.SSN.replace(/^(\d{3})(\d{1})/, '$1-$2'); //XXX-X
        }
    }


    // CC (9/19/16): Called from $rootScope.ionicContentBannerHasHidden() which is fired from ionic.content.banner.js
    $scope.$on("ionicContentBannerHasHidden", function () {
        $scope.isBannerShowing = false;
    });
})
