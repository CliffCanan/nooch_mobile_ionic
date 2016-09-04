angular.module('noochApp.SettingCtrl', ['noochApp.settings-service', 'noochApp.services', 'ngStorage'])

 .controller('SettingCtrl', function ($scope, $rootScope, $timeout, $state, $ionicModal, $ionicLoading,
                                      $localStorage, $sce, $ionicContentBanner, settingsService, CommonServices) {

     $scope.$on("$ionicView.enter", function (event, data) {
         // On Screen Load
         $scope.editBank = false;
         $scope.shouldDisplayErrorBanner = false;
         $scope.errorBannerTextArray = [];

         $timeout(function () {
             if ($rootScope.IsPhoneVerified === false)
             {
                 $scope.errorBannerTextArray.push('ACTION REQUIRED: Phone Number Not Verified');
                 $scope.shouldDisplayErrorBanner = true;
             }

             if ($rootScope.isProfileComplete === false ||
                 $rootScope.IsPhoneVerified === false ||
                 $rootScope.Status === "Registered")
             {
                 $scope.errorBannerTextArray.push('ACTION REQUIRED: Profile Not Complete');
                 $scope.shouldDisplayErrorBanner = true;
             }

             if ($rootScope.Status === "Suspended" ||
                 $rootScope.Status === "Temporarily_Blocked")
             {
                 $scope.errorBannerTextArray.push('ACCOUNT SUSPENDED');
                 $scope.shouldDisplayErrorBanner = true;
             }

             if ($rootScope.hasSynapseBank === true) // CC (8/27/16): Only need to fetch bank details if the user has a Synapse Bank attached
                 $scope.checkBankDetails();
             else if ($rootScope.hasSynapseBank === false)
             {
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
         }, 1000);

         $scope.url = 'http://nooch.info//noochweb//Nooch//AddBank?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId;
         $scope.trustedUrl = $sce.trustAsResourceUrl($scope.url);
     });


     // Viewing Add Bank Webview (in an Ionic Modal)
     $ionicModal.fromTemplateUrl('addBankModal.html', {
         scope: $scope,
         animation: 'slide-in-up'
     }).then(function (modal) {
         $scope.addBankModal = modal;
     });


     $scope.editBankTapped = function () {
         $scope.editBank = true;
         //$('#editBnkBtn').addClass('hide');
     }


     $scope.delBank = function () {
         swal({
             title: "Remove Bank?",
             text: "Are you sure you want to remove this bank account?<span class='show f-600'>" + $scope.bankData.bankName +
			 	   "</span><span class='show f-500 m-b-15'>This cannot be undone.</span>",
             type: "warning",
             showCancelButton: true,
             confirmButtonColor: "red",
             confirmButtonText: "Yes - Delete",
             html: true
         }, function (isConfirm) {
             if (isConfirm)
             {
                 settingsService.DeleteAttachedBankNode()
                    .success(function (result) {
                        console.log(result);
                        $ionicLoading.hide();

                        if (result == 'Deleted')
                        {
                            swal({
                                title: "Bank Deleted",
                                text: "The following bank account was successfully removed from your account:" +
									  "<span class='show m-b-15'>" + $scope.bankData.bankName + "</span>",
                                type: "success",
                                confirmButtonColor: "#3fabe1",
                                confirmButtonText: "Ok",
                                html: true
                            }, function (isConfirm) {
                                if (isConfirm)
                                    $scope.checkBankDetails();
                            });
                        }
                        else
                            swal("Error", result, "error");
                    })
					.error(function (encError) {
					    CommonServices.logOut();
					});
             }
         });
     }


     $scope.openAddBank = function () {
         if ($rootScope.Status == "Suspended" ||
             $rootScope.Status == "Temporarily_Blocked")
         {
             swal({
                 title: "Account Suspended",
                 text: "Your account has been suspended pending a review. Please email support@nooch.com if you believe this was in error and we will be glad to help.",
                 type: "error",
                 confirmButtonColor: "#3fabe1",
                 confirmButtonText: "Ok"
             });
         }
         else if ($rootScope.Status == "Registered")
         {
             swal({
                 title: "Please Verify Your Email",
                 text: "Terribly sorry, but before you send money or add a bank account, please confirm your email address by clicking the link we sent to the email address you used to sign up.",
                 type: "warning",
                 confirmButtonColor: "#3fabe1",
                 confirmButtonText: "Ok"
             });
         }
         else if ($rootScope.IsPhoneVerified == false)
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
                 text: "You can only have one bank account attached at a time. &nbsp;If you link a new account, it will replace your current bank account. &nbsp;This cannot be undone." +
                       "<span class='show'>Are you sure you want to replace this bank account?</span>",
                 type: "warning",
                 confirmButtonColor: "#3fabe1",
                 confirmButtonText: "Yes",
                 showCancelButton: true,
                 cancelButtonText: "Cancel",
                 html: true,
             }, function (isConfirm) {
                 if (isConfirm) $scope.addBankModal.show();
             });
         }
         else
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