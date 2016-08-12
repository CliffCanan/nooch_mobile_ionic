angular.module('noochApp.profileCtrl', ['noochApp.profile-service', 'noochApp.services', 'ngCordova'])
.controller('profileCtrl', function ($scope, CommonServices, profileService, $state, $ionicHistory, $localStorage, $cordovaNetwork, $ionicLoading, $cordovaDatePicker, $cordovaImagePicker, $ionicPlatform, $cordovaCamera, $ionicContentBanner,$rootScope) {

    $rootScope.$broadcast('IsVerifiedPhoneTrue');

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('Profile Page Loadad');       

        $scope.Status = $localStorage.GLOBAL_VARIABLES.Status;
        $scope.IsPhoneVerified = $localStorage.GLOBAL_VARIABLES.IsPhoneVerified;
        $scope.MemberDetails();
    })

    $scope.$on('IsValidProfileFalse', function (event, args) {
        console.log('IsValidProfileFalse');
        //$scope.valid = false;
        $scope.contentBannerInstance1();
    });
    $scope.contentBannerInstance1 = function () {
        $ionicContentBanner.show({

            text: ['Profile Not Validated'],
            interval: '20',
            autoClose: '',
            type: 'error',
            transition: 'vertical'
        });
    }



    $scope.$on('IsVerifiedPhoneFalse', function (event, args) {
        console.log('IsVerifiedPhoneFalse');
        //$scope.verified = false;
        $scope.contentBannerInstance();
    });

    $scope.contentBannerInstance = function () {
        $ionicContentBanner.show({

            text: ['Phone Number Not verified'],
            interval: '20',
            autoClose: '4900',
            type: 'error',
            transition: 'vertical'
        });
    }



    $scope.$on('foundPendingReq', function (event, args) {
        console.log('foundPendingReq');
        $scope.contentBannerInstance2();
    });

    $scope.contentBannerInstance2 = function () {
        $ionicContentBanner.show({

            text: ['Pending Request Waiting'],
            interval: '50',
            autoClose: '3000',
            type: 'info',
            transition: 'vertical'
        });
    }

    $scope.MemberDetails = function () {
        console.log('MemberDetails Function Fired');
        //console.log($localStorage.GLOBAL_VARIABLES);

        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading Profile'
        });       

        profileService.GetMyDetails()
                .success(function (details) {
                    console.log(details);
                    $scope.Details = details;
                  //  console.log('Profile Data GetMyDetails');
                   // console.log($scope.Details);
                    $ionicLoading.hide();
                })
                .error(function (encError) {
                    console.log('Profile Error: [' + encError + ']');
                    $ionicLoading.hide();
                  //  if (encError.ExceptionMessage == 'Invalid OAuth 2 Access')
                    { CommonServices.logOut(); }
                })

        //}
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}
    }


    $scope.UpdateProfile = function () {
        console.log('Update Profile Function Touched');
        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });

        //console.log('Values from Profile.html Page...');
        console.log($scope.Details);

        profileService.MySettings($scope.Details)
            .success(function (data) {
                console.log(data);
                $scope.Data = data;
                console.log('from UpdateProfile function');
                $scope.saveDob($scope.Details.DateOfBirth);
                $ionicLoading.hide();
            }
    ).error(function (encError) {
        console.log('came in enc error block ' + encError);
        $ionicLoading.hide();
      //  if (encError.ExceptionMessage == 'Invalid OAuth 2 Access')
        { CommonServices.logOut(); }
    })
        //}
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}
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
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };

        document.addEventListener("deviceready", function () {

            $cordovaDatePicker.show(options).then(function (date) {
                //  alert(date);
                $scope.Details.DateOfBirth = date;
                if ($scope.Details.DateOfBirth != null)
                {
                    //   $scope.saveDob($scope.Details.DateOfBirth);
                    console.log('from showdate function');
                    console.log($scope.Details.DateOfBirth);
                }
            });

        }, false);

    }


    $scope.saveDob = function (DateOfBirth) {
        console.log('saveDob Function Touched');
        console.log($scope.Details.DateOfBirth);
        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });
        profileService.SaveDOBForMember($scope.Details.DateOfBirth)
                .success(function (details) {
                    console.log(details);

                    if (details.Result == 'DOB saved successfully.')
                    {
                        swal("Yup..", "Profile Updated", "success");
                    }
                    else
                    {
                        swal("Oops...", "Something Went Wrong", "error");
                    }

                    $scope.Details = details;

                    $ionicLoading.hide();
                }
        ).error(function (encError) {
            console.log('came in enc error block ' + encError);
            $ionicLoading.hide();
           // if (encError.ExceptionMessage == 'Invalid OAuth 2 Access')
            { CommonServices.logOut(); }
        })

        //}
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}
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
                console.log('imagedata --- ');
                console.log(imageData);
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
                console.log('after converting base 64 imgURL');
                console.log($scope.imgURI);


                var binary_string = window.atob(imageData);
                var len = binary_string.length;
                var bytes = new Uint8Array(len);
                for (var i = 0; i < len; i++)
                {
                    bytes[i] = binary_string.charCodeAt(i);
                }

                console.log(bytes);
                $scope.Details.picture = bytes;

                $scope.Details.Photo = imageData;
                // $scope.Details.Photo = imageData;

            }, function (err) {
                // An error occured. Show a message to the user
            });
        });
    }
    
})
