angular.module('noochApp.profileCtrl', ['noochApp.profile-service', 'noochApp.services', 'ngCordova'])
.controller('profileCtrl', function ($scope, CommonServices, profileService, $state, $ionicHistory, $localStorage, $cordovaNetwork, $ionicLoading, $cordovaDatePicker, $cordovaImagePicker, $ionicPlatform, $cordovaCamera, $ionicContentBanner, $rootScope, $ionicActionSheet) {

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
                transition: 'vertical'
            });

            $('#profileTopSection').addClass('p-t-35');
        }
        else if ($('#profileTopSection').hasClass('p-t-35'))
            $('#profileTopSection').removeClass('p-t-35');

        $scope.isAnythingChanged = false;
        $scope.MemberDetails();
    })


    $scope.MemberDetails = function () {
        console.log('MemberDetails Function Fired');
        //console.log($localStorage.GLOBAL_VARIABLES);

        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading Profile'
        });

        profileService.GetMyDetails()
            .success(function (details) {
                // console.log('Profile Data GetMyDetails...');
                // console.log(details);

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
            })
        //}
        //else
        //    swal("Oops...", "Internet not connected!", "error");
    }


    $scope.UpdateProfile = function () {
        console.log('Update Profile Function Touched');
        console.log($('#profileForm').parsley().validate());

        if ($('#profileForm').parsley().validate() == true)
        {
            //if ($cordovaNetwork.isOnline()) {
            $ionicLoading.show({
                template: 'Saving Profile...'
            });

            // console.log('Values in Profile Field...------>>>');
            console.log($scope.Details);

            profileService.UpdateProfile($scope.Details)
                .success(function (data) {
                    console.log(data);

                    $ionicLoading.hide();

                    if (data.Result.indexOf('successfully') > -1)
                    {
                        $ionicContentBanner.show({
                            text: ['Profile Updated Successfully!'],
                            autoClose: '5000',
                            type: 'success',
                            transition: 'vertical'
                        });

                        if ($scope.Details.SSN != null)
                            $scope.saveSSN($scope.Details);

                        $scope.isAnythingChanged = false;

                        if ($scope.shouldGoToSettings)
                            $state.go('app.settings');
                        else
                        {
                            console.log("about TO RELOAD");
                            $state.reload();
                        }
                    }
                    else if (data.Result.indexOf('Phone Number already registered with Nooch') > -1)
                    {
                        $ionicContentBanner.show({
                            text: ['Phone Number already registered with Nooch :-( '],
                            autoClose: '5000',
                            type: 'error',
                            transition: 'vertical'
                        });
                    }
                    else
                        $ionicContentBanner.show({
                            text: ['Error: Profile NOT Updated :-('],
                            autoClose: '5000',
                            type: 'error',
                            transition: 'vertical'
                        });
                })
                .error(function (error) {
                    console.log('UpdateProfile Error: [' + JSON.stringify(error) + ']');

                    $ionicLoading.hide();

                    if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
                        CommonServices.logOut();
                    else
                        $ionicContentBanner.show({
                            text: ['Error Saving Profile Changes :-('],
                            autoClose: '5000',
                            type: 'error',
                            transition: 'vertical'
                        });
                })
            //}
            //else
            //    swal("Oops...", "Internet not connected!", "error");
        }
    }


    $scope.ResendVerificationLink = function () {
        swal({
            title: "Resend Confirmation Link?",
            text: "Your email address <strong>(" + $scope.Details.UserName + ")</strong> is unverified." +
                  "<span class='show'>Would you like us to re-send a verification link now?</span>",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3fabe1",
            confirmButtonText: "OK",
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
                               text: ['Email Confirmation Link Sent'],
                               autoClose: '5000',
                               type: 'success',
                               transition: 'vertical'
                           });
                       else
                           $ionicContentBanner.show({
                               text: ['Error: Email Confirmation Link Not Sent :-('],
                               autoClose: '5000',
                               type: 'error',
                               transition: 'vertical'
                           });
                   })
				   .error(function (error) {
				       console.log('ResendVerificationLink Error: [' + JSON.stringify(error) + ']');

				       if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
				           CommonServices.logOut();
				       else
				           $ionicContentBanner.show({
				               text: ['Error: Email Confirmation Link Not Sent :-('],
				               autoClose: '5000',
				               type: 'error',
				               transition: 'vertical'
				           });
				   });
            }
        });
    }


    $scope.ResendVerificationSMS = function () {
        swal({
            title: "Resend Confirmation Link?",
            text: "Your phone number <strong>(" + $scope.Details.ContactNumber + ")</strong> is unverified." +
                  "<span class='show'>Would you like us to re-send a verification text message now?</span>",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3fabe1",
            confirmButtonText: "OK",
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
                           swal("Check Your Phone!", "We just sent an SMS message to " + $scope.Details.ContactNumber + ".", "success");
                       else
                           $ionicContentBanner.show({
                               text: ['Error: Verification SMS Not Sent :-('],
                               autoClose: '5000',
                               type: 'error',
                               transition: 'vertical'
                           });
                   })
				   .error(function (error) {
				       $ionicLoading.hide();
				       console.log('ResendVerificationSMS Error: [' + JSON.stringify(error) + ']');

				       if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
				           CommonServices.logOut();
				       else
				           $ionicContentBanner.show({
				               text: ['Error: Verification SMS Not Sent :-('],
				               autoClose: '5000',
				               type: 'error',
				               transition: 'vertical'
				           });
				   })
            }
        });
    }


    // Date Picker Plugin
    $scope.showdate = function () {

        var options = {
            date: new Date(),
            mode: 'date', // or 'time'
            minDate: 0,
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
                    //$scope.Details.DateOfBirth = new Date($scope.Details.DateOfBirth);
                    console.log('From DatePicker: [' + $scope.Details.DateOfBirth + ']');
            });
        }, false);
    }


    $scope.changePic = function () {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                  { text: 'From Device Library' },
                  { text: 'Use Camera' }
            ],
            titleText: 'Update Your Profile Picture',
            cancelText: 'Cancel',
            buttonClicked: function (index) {
                if (index == 0)
                {
                    $scope.choosePhoto();
                }
                else if (index == 1)
                {
                    $scope.takePhoto();
                }
                return true;
            }
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
                        console.log(imageData);
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                        $scope.Details.Photo = "data:image/jpeg;base64," + imageData;
                        var binary_string = window.atob(imageData);
                        var len = binary_string.length;
                        var bytes = new Uint8Array(len);

                        for (var i = 0; i < len; i++)
                        {
                            bytes[i] = binary_string.charCodeAt(i);
                        }

                        $scope.Details.Photos = imageData;
                        console.log(bytes);
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
                }
                else
                {
                    swal({
                        title: "Allow Camera Access",
                        text: "This lets you take a picture to use for your profile.",
                        type: "info",
                        confirmButtonText: "Give Access",
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
                console.error("isCameraAuthorized Error: [" + error + ']');
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
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
                $scope.Details.Photo = "data:image/jpeg;base64," + imageData;
                //console.log('after converting base 64 imgURL');
                //console.log($scope.imgURI);

                $scope.Details.Photos = imageData;
            }, function (err) {
                // An error occured. Show a message to the user
            });
        });
    }


    $scope.saveSSN = function (Details) {
        console.log('saveSSN Function Fired');
        console.log($scope.Details.SSN);
        //if ($cordovaNetwork.isOnline()) {

        profileService.SaveMemberSSN($scope.Details)
            .success(function (details) {
                console.log(details);

                if (details == null || details.Result == 'SSN saved successfully.')
                    $ionicContentBanner.show({
                        text: ['Error Saving Profile Changes'],
                        autoClose: '5000',
                        type: 'error',
                        transition: 'vertical'
                    });

                //$scope.Details = details;
            })
			.error(function (error) {
			    console.log('SaveMemberSSN Error: [' + JSON.stringify(error) + ']');

			    $ionicContentBanner.show({
			        text: ['Error Saving Profile Changes'],
			        autoClose: '5000',
			        type: 'error',
			        transition: 'vertical'
			    });

			    if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
			        CommonServices.logOut();
			})
        //}
        //else
        //    swal("Oops...", "Internet not connected!", "error");
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
                cancelButtonText: "NO",
                confirmButtonColor: "#3fabe1",
                confirmButtonText: "OK"
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


    $('.content-banner *').on('click', function () {
        $('#profileTopSection').removeClass('p-t-35');
    });
})
