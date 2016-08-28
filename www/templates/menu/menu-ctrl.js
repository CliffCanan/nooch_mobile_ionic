angular.module('noochApp.MenuCtrl', ['noochApp.services', 'noochApp.menu-service', 'ngStorage'])

.controller('MenuCtrl', function ($scope, $timeout, authenticationService, $ionicActionSheet, $ionicModal, $cordovaNetwork, menuService, $ionicLoading, $localStorage, $cordovaSocialSharing, $sce, profileService, $rootScope, historyService, $ionicPlatform, CommonServices, $state) {

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
	        // console.log($scope.trustedUrl);

	        // Check if user has any Pending Requests
	        $timeout($scope.pendingList, 4000);
		}
	});


    $scope.MemberDetails = function () {
        //console.log('GetMemberDetails Fired');

        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading...'
        });

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

               $localStorage.GLOBAL_VARIABLES.hasSynapseUserAccount = res.hasSynapseUserAccount;
               $localStorage.GLOBAL_VARIABLES.hasSynapseBank = res.hasSynapseBank;
               $localStorage.GLOBAL_VARIABLES.isBankVerified = res.isBankVerified;
               $localStorage.GLOBAL_VARIABLES.bankStatus = res.bankStatus;
               $localStorage.GLOBAL_VARIABLES.synUserPermission = res.synUserPermission;
               $localStorage.GLOBAL_VARIABLES.synBankAllowed = res.synBankAllowed;

               $scope.PicUrl = "http://www.nooch.info/noochservice/UploadedPhotos/Photos/" + $localStorage.GLOBAL_VARIABLES.MemberId + ".png";

               $ionicLoading.hide();

               //console.log("--  menu-ctrl -> ABOUT TO PRINT '$localStorage'  --")
               //console.log($localStorage);

               if ($scope.Res.status === "Suspended" || $scope.Res.status === "Temporarily_Blocked")
                   $rootScope.$broadcast('isSuspended');

               if ($scope.Res.isVerifiedPhone === false)
                   $rootScope.$broadcast('IsVerifiedPhoneFalse');

               if ($scope.Res.status === "Registered" || $scope.Res.isProfileComplete === false)
                   $rootScope.$broadcast('IsValidProfileFalse');

           }).error(function (encError) {
               console.log('GetMemberDetails Error Block: [' + encError + ']');
               $ionicLoading.hide();

               if (encError.ExceptionMessage == 'Invalid OAuth 2 Access')
                   CommonServices.logOut();
           })
        //}
        //else swal("Oops...", "Internet not connected!", "error");
    }

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
                titleText: 'Contact Support',
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
                CommonServices.logOut();
        });
    }


    $scope.goProfile = function () {
        $state.go('app.profile');
    }
})
