angular.module('noochApp.SettingCtrl', ['noochApp.settings-service', 'noochApp.services', 'ngStorage'])
/******************/
/***  SETTINGS  ***/
/******************/
 .controller('SettingCtrl', function ($scope, $rootScope, settingsService, $state, $ionicModal, $ionicLoading, $localStorage, $sce, $ionicContentBanner, CommonServices) {

     $scope.$on("$ionicView.enter", function (event, data) {
         // On Screen Load
         $scope.shouldDisplayErrorBanner = false;
         $scope.errorBannerTextArray = [];

         if ($localStorage.GLOBAL_VARIABLES.IsPhoneVerified != true)
         {
             $scope.isPhoneVerified = false;
             $scope.errorBannerTextArray.push('ACTION REQUIRED: Phone Number Not Verified');
             $scope.shouldDisplayErrorBanner = true;
         }
         else
             $scope.isPhoneVerified = false;

         if ($localStorage.GLOBAL_VARIABLES.isProfileComplete != true ||
             $localStorage.GLOBAL_VARIABLES.Status === "Registered")
         {
             $scope.isProfileComplete = true;
             $scope.errorBannerTextArray.push('ACTION REQUIRED: Profile Not Complete');
             $scope.shouldDisplayErrorBanner = true;
         }
         else
             $scope.isProfileComplete = false;

         if ($localStorage.GLOBAL_VARIABLES.Status === "Suspended" ||
             $localStorage.GLOBAL_VARIABLES.Status === "Temporarily_Blocked")
         {
             $scope.errorBannerTextArray.push('ACCOUNT SUSPENDED');
             $scope.shouldDisplayErrorBanner = true;
         }
         if ($localStorage.GLOBAL_VARIABLES.hasSynapseBank === true)
         {
             $scope.hasSynapseBank = true;
             $scope.bankIsVerified = $localStorage.GLOBAL_VARIABLES.bankStatus === "Verified" ? true : false;
             // CC (8/27/16): Only need to fetch bank details if the user has a Synapse Bank attached
             $scope.checkBankDetails();
         }
         else
         {
             $scope.hasSynapseBank = false;
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

             $('#settings_cntnr').css('margin-top', '55px');
         }


         $scope.url = 'http://nooch.info//noochweb//Nooch//AddBank?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId;
         $scope.trustedUrl = $sce.trustAsResourceUrl($scope.url);
         //console.log($scope.trustedUrl);
     });

     // Viewing Add Bank Webview (in an Ionic Modal)
     $ionicModal.fromTemplateUrl('addBankModal.html', {
         scope: $scope,
         animation: 'slide-in-up'
     }).then(function (modal) {
         $scope.addBankModal = modal;
     });

     $scope.openAddBank = function () {
         if ($localStorage.GLOBAL_VARIABLES.Status == "Suspended" ||
             $localStorage.GLOBAL_VARIABLES.Status == "Temporarily_Blocked")
         {
             swal({
                 title: "Account Suspended",
                 text: "Your account has been suspended pending a review. Please email support@nooch.com if you believe this was in error and we will be glad to help.",
                 type: "error",
                 confirmButtonColor: "#3fabe1",
                 confirmButtonText: "Ok"
             });
         }
         else if ($localStorage.GLOBAL_VARIABLES.Status == "Registered")
         {
             swal({
                 title: "Please Verify Your Email",
                 text: "Terribly sorry, but before you send money or add a bank account, please confirm your email address by clicking the link we sent to the email address you used to sign up.",
                 type: "warning",
                 confirmButtonColor: "#3fabe1",
                 confirmButtonText: "Ok"
             });
         }
         else if ($localStorage.GLOBAL_VARIABLES.IsPhoneVerified == false)
         {
             swal({
                 title: "Blame The Lawyers",
                 text: "To keep Nooch safe, we ask all users to verify a phone number before sending money." +
                       "<span class='show'>If you've already added your phone number, just respond 'Go' to the text message we sent.</span>",
                 type: "warning",
                 confirmButtonColor: "#3fabe1",
                 confirmButtonText: "Ok",
                 html: true
             });
         }
         else if ($localStorage.GLOBAL_VARIABLES.isProfileComplete == false)
         {
             swal({
                 title: "Help Us Keep Nooch Safe",
                 text: "Please take 1 minute to verify your identity by completing your Nooch profile.",
                 type: "warning",
                 confirmButtonColor: "#3fabe1",
                 confirmButtonText: "Go Now",
                 showCancelButton: true,
                 cancelButtonText: "Later",
             }, function (isConfirm) {
                 if (isConfirm)
                     $state.go('app.profile');
             });
         }
         else if ($localStorage.GLOBAL_VARIABLES.hasSynapseBank == true)
         {
             swal({
                 title: "Attach New Bank Account",
                 text: "You can only have one bank account attached at a time. &npsp;If you link a new account, it will replace your current bank account. &nbsp;This cannot be undone." +
                       "<span class='show m-t-10'>Are you sure you want to replace this bank account?</span>",
                 type: "warning",
                 confirmButtonColor: "#3fabe1",
                 confirmButtonText: "Yes - Replace",
                 showCancelButton: true,
                 cancelButtonText: "Cancel",
                 html: true
             });
         }
         else
         {
             $scope.addBankModal.show();
         }
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
             title: "Sign Out?",
             text: "Are you sure you want to sign out?",
             type: "warning",
             showCancelButton: true,
             cancelButtonText: "Cancel",
             confirmButtonColor: "#3fabe1",
             confirmButtonText: "Yes",
             customClass: "stackedBtns"
         }, function (isConfirm) {
             if (isConfirm)
             {
                 $ionicLoading.show({
                     template: 'Signing Out...'
                 });

                 //console.log($localStorage.GLOBAL_VARIABLES.AccessToken);

                 settingsService.logOut($localStorage.GLOBAL_VARIABLES.AccessToken, $localStorage.GLOBAL_VARIABLES.MemberId).success(function (data) {
                     console.log(data.Result);

                     $ionicLoading.hide();

                     if (data.Result == 'Success.' || data.Result == 'Invalid OAuth 2 Access')
                         CommonServices.logOut();
                 }).error(function (encError) {
                     $ionicLoading.hide();
                     CommonServices.logOut();
                 });
             }
         });
         //}
         //else
         //  swal("Oops...", "Internet not connected!", "error");
     };


     $scope.checkBankDetails = function () {
         console.log('CheckBankDetails Fired');

         //if ($cordovaNetwork.isOnline()) {
         $ionicLoading.show({
             template: 'Assembling Your Settings...'
         });

         settingsService.GetSynapseBankAndUserDetails()
           .success(function (data) {
               $scope.bankData = data;

               console.log($scope.bankData);

               $ionicLoading.hide();
           }).error(function (data) {
               console.log('GetSynapseBankAndUserDetails Error: [' + data + ']');
               $ionicLoading.hide();
               if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                   CommonServices.logOut();
           });
         //  }
         //else
         //  swal("Oops...", "Internet not connected!", "error");
     }

 })