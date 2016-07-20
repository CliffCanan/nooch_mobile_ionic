angular.module('noochApp.SettingCtrl', ['noochApp.settings-service', 'noochApp.services', 'ngStorage'])
/******************/
/***  SETTINGS  ***/
/******************/
 .controller('SettingCtrl', function ($scope, settingsService, $state, $ionicModal, $ionicLoading, $localStorage) {

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

     $scope.signOut = function () {
         $ionicLoading.show({
             template: 'Logging off...'
         });
         console.log($localStorage.GLOBAL_VARIABLES.AccessToken);
         settingsService.logOut($localStorage.GLOBAL_VARIABLES.AccessToken, $localStorage.GLOBAL_VARIABLES.MemberId).success(function (data) {
             console.log(data.Result);

             if (data.Result == 'Success.' || (data.Result.indexOf('oAuth') > -1))
             {
                
                 $localStorage.GLOBAL_VARIABLES.IsDemoDone = false;
                 $localStorage.GLOBAL_VARIABLES.IsRemeberMeEnabled = false;
                 $localStorage.GLOBAL_VARIABLES.IsUserLocationSharedWithNooch = false;
                 $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude = '';
                 $localStorage.GLOBAL_VARIABLES.UserCurrentLongi = '';
                 $localStorage.GLOBAL_VARIABLES.MemberId = '';
                 $localStorage.GLOBAL_VARIABLES.UserName = '';
                 $localStorage.GLOBAL_VARIABLES.AccessToken = '';
                 $localStorage.GLOBAL_VARIABLES.IsNotificationPermissionGiven = false;
                 $localStorage.GLOBAL_VARIABLES.DeviceId = '';
                 $localStorage.GLOBAL_VARIABLES.DeviceToken = '';
                 $localStorage.GLOBAL_VARIABLES.DeviceOS = '';
                 console.log($localStorage.GLOBAL_VARIABLES);
                 $ionicLoading.hide();
                 $state.go('login');
             }
         }).error(function (encError) {
             console.log('came in enc error block ' + encError);
             $ionicLoading.hide();
            
         });

     };


 })