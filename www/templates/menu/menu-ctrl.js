angular.module('noochApp.MenuCtrl', ['noochApp.services', 'noochApp.menu-service', 'ngStorage'])

.controller('MenuCtrl', function ($scope, $timeout, authenticationService, $ionicActionSheet, $ionicModal, $cordovaNetwork, menuService, $ionicLoading, $localStorage, $cordovaSocialSharing, $sce, profileService, $rootScope, historyService, $cordovaImagePicker, $cordovaCamera, $ionicPlatform, CommonServices) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('MenuCtrl Ctrl Loaded');

        $scope.MemberDetails();
        // console.log('Loaded First Time');

        $scope.url = 'http://support.nooch.com/';
        $scope.trustedUrl = $sce.trustAsResourceUrl($scope.url);
        console.log($scope.trustedUrl);

        $scope.MemberInfo();  //For checking user's Profile Status and PhoneNo Status.
        $timeout($scope.pendingList, 5000); // For checking User's Pending Request.

    });

    //$scope.settingsClick = function () {
    //    $state.go("app.setting");
    //};

    $scope.showActionSheet = function (id) {

        // Show the correct Action Sheet

        if (id == 'support')
        {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                  { text: 'Report a Bug' },
                  { text: 'Email Nooch Support' },
                  { text: 'View Support Center' }
                ],
                titleText: 'Contact Support',
                cancelText: 'Cancel',
                //cancel: function () {
                //},
                buttonClicked: function (index) {
                    if (index == 0)
                    {
                        // toArr, ccArr and bccArr must be an array, file can be either null, string or array
                        // .shareViaEmail(message, subject, toArr, ccArr, bccArr, file) --Params
                        $cordovaSocialSharing
                          .shareViaEmail('Hello', 'Got a bug', 'cliff@nooch.com', null, null, null)
                          .then(function (result) {
                              // Success!                              
                              console.log('from social sharing success');
                          }, function (err) {
                              // An error occurred. Show a message to the user                            
                              console.log('from social sharing fail');
                          });

                    }
                    else if (index == 1)
                    {
                        // toArr, ccArr and bccArr must be an array, file can be either null, string or array
                        //.shareViaEmail(message, subject, toArr, ccArr, bccArr, file) --Params
                        $cordovaSocialSharing
                          .shareViaEmail('Hello', 'Getting from Nooch', 'cliff@nooch.com', null, null, null)
                          .then(function (result) {
                              // Success!                              
                              console.log('from social sharing success');
                          }, function (err) {
                              // An error occurred. Show a message to the user                            
                              console.log('from social sharing fail');
                          });

                    }
                    else if (index == 2)
                    {
                        $scope.openSupportCenter();
                    }

                    return true;
                }
            });
        }
        else if (id == 'legal')
        {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                  { text: 'Terms of Service' },
                  { text: 'Privacy Policy' }
                ],
                titleText: 'Contact Support',
                cancelText: 'Cancel',
                //cancel: function () {
                //},
                buttonClicked: function (index) {
                    if (index == 0)
                    {
                        $scope.openTos();
                    }
                    else if (index == 1)
                    {
                        $scope.openPrivacy();
                    }
                    return true;
                }
            });
        }
    };


    // Viewing TOS Webview (in an Ionic Modal)
    $ionicModal.fromTemplateUrl('tosModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.tosModal = modal;
    });

    $scope.openTos = function () {
        $scope.tosModal.show();
    };

    $scope.closeTos = function () {
        $scope.tosModal.hide();
    };

    // Viewing Privacy Policy Webview (in an Ionic Modal)
    $ionicModal.fromTemplateUrl('privacyModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.privacyModal = modal;
    });

    $scope.openPrivacy = function () {
        $scope.privacyModal.show();
    };

    $scope.closePrivacy = function () {
        $scope.privacyModal.hide();
    };

    // Viewing Support Center Modal Webview (in an Ionic Modal)
    $ionicModal.fromTemplateUrl('supportCenterModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.supportCenterModal = modal;
    });

    $scope.openSupportCenter = function () {
        $scope.supportCenterModal.show();
    };

    $scope.closeSupportCenter = function () {
        $scope.supportCenterModal.hide();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.tosModal.remove();
        $scope.privacyModal.remove();
        $scope.supportCenterModal.remove();
    });


    $scope.MemberDetails = function () {
        console.log('GetMemberDetails Fired');

        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });

        menuService.GetMemberDetails()
           .success(function (res) {
               console.log(res);
               $scope.Res = res;
               $localStorage.GLOBAL_VARIABLES.PhotoUrl = res.PhotoUrl;
               $localStorage.GLOBAL_VARIABLES.Status = res.Status;
               $localStorage.GLOBAL_VARIABLES.IsPhoneVerified = res.IsVerifiedPhone;
               $ionicLoading.hide();
           }
           ).error(function (encError) {
               console.log('came in enc error block ' + encError);
               $ionicLoading.hide();

               if (encError.ExceptionMessage == 'Invalid OAuth 2 Access')
               { CommonServices.logOut(); }
           })

        //}
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}
    }


    $scope.MemberInfo = function () {
        console.log('MemberDetails Function Fired');

        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading Details...'
        });

        profileService.GetMyDetails()
                .success(function (details) {

                    $scope.Details = details;

                    console.log('GetMyDetails() ->');
                    console.log($scope.Details);

                    if ($scope.Details.IsVerifiedPhone == false)
                    {
                        //console.log('value in IsVerifiedPhone');
                        //console.log($scope.Details.IsVerifiedPhone);
                        $rootScope.$broadcast('IsVerifiedPhoneFalse');
                    }

                    if ($scope.Details.IsValidProfile == false)
                        $timeout($scope.validProfile, 8000);

                    $ionicLoading.hide();
                })
                .error(function (encError) {
                    console.log('Profile Error: [' + encError + ']');
                    $ionicLoading.hide();
                    if (encError.ExceptionMessage == 'Invalid OAuth 2 Access')
                    { CommonServices.logOut(); }
                })

        //}
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}
    }

    $scope.validProfile = function () {
        console.log('value in IsValidProfile');
        console.log($scope.Details.IsValidProfile);
        $rootScope.$broadcast('IsValidProfileFalse');
    }

    $scope.pendingList = function () {
        historyService.getTransferList().success(function (data) {
            $scope.Data = data;

            var hasPendingPayments = false;

            for (var i = 0; i <= data.length; i++)
            {
                if (data[i] != null && data[i].TransactionStatus == 'Pending')
                {
                    //console.log(data[i]);
                    if (!hasPendingPayments)
                    {
                        $rootScope.$broadcast('foundPendingReq');
                        hasPendingPayments = true;
                    }
                }
            }

            $ionicLoading.hide();

        }).error(function (data) {
            console.log('Get History Error: [' + data + ']');
            $ionicLoading.hide();
            if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
            { CommonServices.logOut(); }
        });
    }


    $scope.choosePhoto = function () {
        console.log('Choose Photo Function called');
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

                $scope.Details.Photo = imageData;
              
                console.log('Update Photo Function Touched');
                //if ($cordovaNetwork.isOnline()) {
                $ionicLoading.show({
                    template: 'Loading ...'
                });

                console.log('Values in scope.Details within fn...');

                console.log($scope.Details);

                profileService.MySettings($scope.Details)
                    .success(function (data) {
                        console.log(data);
                        $scope.Data = data;
                        
                        $ionicLoading.hide();
                    }
            ).error(function (encError) {
                console.log('came in enc error block ' + encError);
                $ionicLoading.hide();
                if (encError.ExceptionMessage == 'Invalid OAuth 2 Access')
                { CommonServices.logOut(); }
            })
                //}
                //else {
                //    swal("Oops...", "Internet not connected!", "error");
                //}

            }, function (err) {
                // An error occured. Show a message to the user
            });
        });
    }
})
