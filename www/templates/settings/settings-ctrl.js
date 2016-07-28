angular.module('noochApp.SettingCtrl', ['noochApp.settings-service', 'noochApp.services', 'ngStorage'])
/******************/
/***  SETTINGS  ***/
/******************/
 .controller('SettingCtrl', function ($scope, settingsService, $state, $ionicModal, $ionicLoading, $localStorage) {

     $scope.$on("$ionicView.enter", function (event, data) {
         // On Screen Load

         $scope.checkBankDetails();
     });

   
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

         //  if ($cordovaNetwork.isOnline()) {

          swal({
                    title: "Log Out!",
                    text: "Are you sure logging out.",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "Cancel",
                    confirmButtonColor: "#3fabe1",
                    confirmButtonText: "Yes",
                    customClass: "stackedBtns",
                    html: true,
                  }, function (isConfirm) {
                    if (isConfirm) {
                        $ionicLoading.show({
                            template: 'Logging off...'
                        });
                        console.log($localStorage.GLOBAL_VARIABLES.AccessToken);
                        settingsService.logOut($localStorage.GLOBAL_VARIABLES.AccessToken, $localStorage.GLOBAL_VARIABLES.MemberId).success(function (data) {
                            console.log(data.Result);

                            if (data.Result == 'Success.' || (data.Result.indexOf('oAuth') > -1)) {

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
                        });
                    }
                  });

       
         //}
         //else{
         //        swal("Oops...", "Internet not connected!", "error");
         //      }
     };
     

     $scope.checkBankDetails = function () {
         console.log('checkBankDetails function Touched');

         //if ($cordovaNetwork.isOnline()) {
         $ionicLoading.show({
             template: 'Loading ...'
         });

         settingsService.GetSynapseBankAndUserDetails()
           .success(function (data) {
               $scope.Data = data;                         

               console.log($scope.Data);

               $ionicLoading.hide();
           }).error(function (data) {
               console.log('eror' + data);
               $ionicLoading.hide();
           });
         //  }
         //else {
         //    swal("Oops...", "Internet not connected!", "error");
         //}        
     }



 })