﻿angular.module('noochApp.MenuCtrl', ['noochApp.services', 'noochApp.menu-service', 'ngStorage'])

.controller('MenuCtrl', function ($scope, authenticationService, $ionicActionSheet, $ionicModal, $cordovaNetwork, menuService, $ionicLoading, $localStorage, $cordovaSocialSharing, $sce) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('MenuCtrl Ctrl Loaded');           

           // $scope.MemberDetails();
           // console.log('Loaded First Time');

        $scope.url = 'http://support.nooch.com/';
        $scope.trustedUrl = $sce.trustAsResourceUrl($scope.url);
        console.log($scope.trustedUrl);
               
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
                          .shareViaEmail('Hello', 'Got a bug','cliff@nooch.com', null, null, null)
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
           })

        //}
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}
    }
})
