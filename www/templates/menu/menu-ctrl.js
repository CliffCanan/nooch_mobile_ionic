angular.module('noochApp.MenuCtrl', ['noochApp.services', 'noochApp.menu-service'])

.controller('MenuCtrl', function ($scope, authenticationService, $ionicActionSheet, $ionicModal, $cordovaNetwork, menuService, $ionicLoading) {
    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('MenuCtrl ctrl loaded');
    // $scope.MemberDetails();
    });

    //$scope.settingsClick = function () {
    //    $state.go("app.setting");
    //};

    $scope.showActionSheet = function (id) {

        // Show the correct Action Sheet

        if (id == 'support') {
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
                    if (index == 0) {

                    }
                    else if (index == 1) {

                    }
                    else if (index == 3) {

                    }

                    return true;
                }
            });
        }
        else if (id == 'legal') {
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
                    if (index == 0) {
                        $scope.openTos();
                    }
                    else if (index == 1) {
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

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.tosModal.remove();
        $scope.privacyModal.remove();
    });



    $scope.MemberDetails = function () {
        console.log('GetMemberDetails touched');
        //if ($cordovaNetwork.isOnline()) {
            $ionicLoading.show({
                template: 'Loading ...'
            });

            menuService.GetMemberDetails()
               .success(function (res) {
                   console.log(res);
                   $scope.Res = res;
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
