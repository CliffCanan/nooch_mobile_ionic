angular.module('noochApp.MenuCtrl', ['noochApp.services', 'noochApp.menu-service', 'ngStorage'])

.controller('MenuCtrl', function ($scope, $timeout, authenticationService, $cordovaAppRate, $ionicActionSheet, $ionicModal, $cordovaNetwork, menuService, $ionicLoading, $localStorage, $cordovaSocialSharing, $sce, profileService, $rootScope, historyService, $ionicPlatform, CommonServices, $state, $cordovaGoogleAnalytics) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('MenuCtrl Ctrl Loaded');

        if ($localStorage.GLOBAL_VARIABLES.MemberId == '')
        {
            CommonServices.logOut();
        }
        else
        {
            $scope.MemberDetails();

            $scope.url = 'http://support.nooch.com/';
            $scope.trustedUrl = $sce.trustAsResourceUrl($scope.url);

            // Check if user has any Pending Requests
            if ($rootScope.hasSynapseUserAccount && $rootScope.hasSynapseBank == true)
                $timeout($scope.pendingList, 4000);
        }

        $ionicPlatform.ready(function () {
            if (typeof analytics !== 'undefined') analytics.trackView("Menu Controller");
        })
    });


    $scope.MemberDetails = function () {
        //console.log('GetMemberDetails Fired');

        //if ($cordovaNetwork.isOnline()) {
        //$ionicLoading.show({
        //    template: 'Loading...'
        //});

        menuService.GetUserDetails()
            .success(function (res) {
                console.log("GetUserDetails - Menu Cntrlr -->");
                console.log(res);

                $scope.Res = res;

                $localStorage.GLOBAL_VARIABLES.PhotoUrl = res.userPicture;
                $localStorage.GLOBAL_VARIABLES.Status = res.status;
                $localStorage.GLOBAL_VARIABLES.IsPhoneVerified = res.isVerifiedPhone;
                $localStorage.GLOBAL_VARIABLES.firstName = res.firstName;
                $localStorage.GLOBAL_VARIABLES.lastName = res.lastName;
                $localStorage.GLOBAL_VARIABLES.isProfileComplete = res.isProfileComplete;
                $localStorage.GLOBAL_VARIABLES.isRequiredImmediately = res.isRequiredImmediately;
                $localStorage.GLOBAL_VARIABLES.IsRemeberMeEnabled = res.rememberMe;
                $localStorage.GLOBAL_VARIABLES.hasSynapseUserAccount = res.hasSynapseUserAccount;
                $localStorage.GLOBAL_VARIABLES.hasSynapseBank = res.hasSynapseBank;
                $localStorage.GLOBAL_VARIABLES.isBankVerified = res.isBankVerified;
                $localStorage.GLOBAL_VARIABLES.bankStatus = res.bankStatus;
                $localStorage.GLOBAL_VARIABLES.synUserPermission = res.synUserPermission;
                $localStorage.GLOBAL_VARIABLES.synBankAllowed = res.synBankAllowed;

                $scope.PicUrl = res.userPicture;//"http://www.nooch.info/noochservice/UploadedPhotos/Photos/" + $localStorage.GLOBAL_VARIABLES.MemberId + ".png";

                // CC (9/1/16): SETTING $rootScope values so we can access directly in HTML pages w/o setting in each scope
                $rootScope.memberId = res.memberId;
                $rootScope.emailAddress = res.email;
                $rootScope.contactNumber = res.contactNumber;
                $rootScope.isProfileComplete = res.isProfileComplete;
                $rootScope.isBankVerified = res.isBankVerified;
                $rootScope.IsPhoneVerified = res.isVerifiedPhone;
                $rootScope.Status = res.status;
                $rootScope.isRequiredImmediately = res.isRequiredImmediately;
                $rootScope.hasSynapseUserAccount = res.hasSynapseUserAccount;
                $rootScope.hasSynapseBank = res.hasSynapseBank;
                $rootScope.bankStatus = res.bankStatus;
                $rootScope.synUserPermission = res.synUserPermission;
                $rootScope.synBankAllowed = res.synBankAllowed;
                $rootScope.pinEnc = res.pin;
                $rootScope.fbid = res.fbUserId;

                $ionicLoading.hide();

                // Now check if the user has any pending transactions
                // $timeout($scope.pendingList, 2000);


                //if ($scope.Res.status === "Suspended" || $scope.Res.status === "Temporarily_Blocked")
                //    $rootScope.$broadcast('isSuspended');

                //if ($scope.Res.isVerifiedPhone === false)
                //    $rootScope.$broadcast('IsVerifiedPhoneFalse');

                //if ($scope.Res.status === "Registered" || $scope.Res.isProfileComplete === false)
                //    $rootScope.$broadcast('IsValidProfileFalse');
            })
            .error(function (error) {
                console.log('GetMemberDetails Error Block: [' + JSON.stringify(error) + ']');
                $ionicLoading.hide();

                if (error != null && (error.ExceptionMessage == 'Invalid OAuth 2 Access' || error.ExceptionMessage == 'Server Error'))
                    CommonServices.logOut();
            })
        //}
        //else swal("Oops...", "Internet not connected!", "error");
    }


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
                buttonClicked: function (index) {
                    if (index == 0)
                    {
                        // toArr, ccArr and bccArr must be an array, file can be either null, string or array
                        // .shareViaEmail(message, subject, toArr, ccArr, bccArr, file) --Params
                        $cordovaSocialSharing
                          .shareViaEmail('Hi Nooch, I found a bug and wanted to tell you!', 'Found a Nooch Bug!', 'bugs@nooch.com', null, null, null)
                          .then(function (result) {
                              // Success!
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
                          .shareViaEmail('Hi Nooch - Please help me!', 'Nooch Support Request', 'support@nooch.com', null, null, null)
                          .then(function (result) {
                              // Success!
                          }, function (err) {
                              // An error occurred. Show a message to the user
                              console.log('from social sharing fail');
                          });
                    }
                    else if (index == 2)
                        $scope.openSupportCenter();

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
                titleText: 'Legal Info',
                cancelText: 'Cancel',
                //cancel: function () {
                //},
                buttonClicked: function (index) {
                    if (index == 0) $scope.openTos();
                    else if (index == 1) $scope.openPrivacy();
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


    $scope.pendingList = function () {
        historyService.getTransferList()
			.success(function (data) {
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
			})
			.error(function (data) {
			    console.log('GetTransferList Error: [' + JSON.stringify(data) + ']');
			    if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
			        CommonServices.logOut();
			});
    }


    $scope.goProfile = function () {
        $state.go('app.profile');
    }


    $scope.rateNooch = function () {
        document.addEventListener("deviceready", function () {


            AppRate.preferences = {
                openStoreInApp: true,
                displayAppName: 'Nooch',
                usesUntilPrompt: 8,
                promptAgainForEachNewVersion: false,
                storeAppURL: {
                    ios: '917955306',
                    android: 'market://details?id=com.soundcloud.android'
                },
                customLocale: {
                    title: "Rate Nooch",
                    message: "If you enjoy using Nooch or are just in a good mood, we'd LOVE you forever if you take a quick minute to leave us a review!",
                    cancelButtonLabel: "Not Now",
                    laterButtonLabel: "Remind Me Later",
                    rateButtonLabel: "Sure, Let's Go"
                }
            };

            AppRate.promptForRating(false);

            $cordovaAppRate.promptForRating(true).then(function (result) {
                // success
                console.log('came in rate nooch ok');
            });
        }, false);

        document.addEventListener("deviceready", function () {

            $cordovaAppRate.navigateToAppStore().then(function (result) {
                // success
                console.log('navigated to nooch store');
            });
        }, false);
    }
})
