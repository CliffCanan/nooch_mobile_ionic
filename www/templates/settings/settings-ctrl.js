angular.module('noochApp.SettingCtrl', ['noochApp.services'])
/******************/
/***  SETTINGS  ***/
/******************/
 .controller('SettingCtrl', function ($scope, authenticationService, $state, $ionicModal) {

     $scope.$on("$ionicView.enter", function (event, data) {
         // On Screen Load
     });

     //$scope.go = function (data) {
     //    if (data == 'Social') {
     //        $state.go('socialSetting');
     //    }
     //    else if (data == 'Notification') {
     //        $state.go('NotificationSetting');
     //    }
     //    else if (data == 'Security') {
     //        $state.go('securitySetting');
     //    }
     //    else if (data == 'profile') {
     //        $state.go('profile');
     //    }
     //}


     // Viewing Add Bank Webview (in an Ionic Modal)
     $ionicModal.fromTemplateUrl('addBankModal.html', {
         scope: $scope,
         animation: 'slide-in-up'
     }).then(function (modal) {
         $scope.addBankModal = modal;
     });

     $scope.openAddBank = function () {
         // CC (7/16/16): Need to make sure user has completed all Profile info (for Synapse)
         $scope.addBankModal.show();
     };

     $scope.closeAddBank = function () {
         $scope.addBankModal.hide();
     };

     // Cleanup the modal when we're done with it!
     $scope.$on('$destroy', function () {
         $scope.tosModal.remove();
         $scope.privacyModal.remove();
     });
 })