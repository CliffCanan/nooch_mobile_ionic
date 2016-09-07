angular.module('noochApp.SettingCtrl', ['noochApp.settings-service', 'noochApp.services', 'ngStorage'])

 .controller('SettingCtrl', function ($scope, $rootScope, $timeout, $state, $ionicModal, $ionicLoading,
                                      $localStorage, $sce, $ionicContentBanner, settingsService, CommonServices) {

     $scope.$on("$ionicView.enter", function (event, data) {
         // On Screen Load
		 console.log("$scope.editBank is: " + $scope.editBank);
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
         }, 500);

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
		 $('#editBnkBtn i').addClass('animated bounceIn');
         $scope.editBank = true;
		 
		 $timeout(function () {
		 	$('#editBnkBtn i').removeClass('animated bounceIn');
		 }, 1000);
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
							$scope.editBank = false;
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
		 $scope.editBank = false;

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
                 confirmButtonText: "Ok",
                 showCancelButton: true,
                 cancelButtonText: "Resend Email"
             }, function (isConfirm) {
                 if (!isConfirm)
                 {
                     $ionicLoading.show({
                         template: 'Sending Verification Link...'
                     });

                     CommonServices.ResendVerificationLink()
                        .success(function (result) {
                            $ionicLoading.hide();

                            if (result.Result == 'Success')
                                swal("Check Your Email", "We just sent an email to " + $rootScope.emailAddress + ". Please click the verification link to activate your account.", "success");
                            else
                                swal("Error", "We were unable to re-send the email verification link.  Please try again or contact Nooch Support.", "error");
                        })
                        .error(function (error) {
                            console.log('ResendVerificationLink Error: [' + JSON.stringify(error) + ']');

                            if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
                                CommonServices.logOut();
                            else
                                swal("Error", "We were unable to re-send the email verification link.  Please try again or contact Nooch Support.", "error");
                        });
                 }
             });
         }
         else if ($rootScope.IsPhoneVerified == false)
         {
             var isPhoneAdded = false;
             var bodyTxt = "Would you like to add a number now?";
             var confirmBtnTxt = "Add Now";

             if ($rootScope.ContactNumber != null && $rootScope.contactNumber != "")
             {
                 isPhoneAdded = true;
                 bodyTxt = "You should have received a text message from us. Just respond 'Go' to confirm your number.";
                 confirmBtnTxt = "Resend SMS";
             }

             swal({
                 title: "Blame The Lawyers",
                 text: "To keep Nooch safe, we ask all users to verify a phone number before sending money." +
                       "<span class='show'></span>",
                 type: "warning",
                 confirmButtonColor: "#3fabe1",
                 confirmButtonText: confirmBtnTxt,
                 showCancelButton: true,
                 cancelButtonText: "Ok",
                 html: true,
             }, function (isConfirm) {
                 if (isConfirm)
                 {
                     if (isPhoneAdded)
                     {

                         $ionicLoading.show({
                             template: 'Sending SMS...'
                         });

                         CommonServices.ResendVerificationSMS()
                            .success(function (result) {
                                $ionicLoading.hide();
                                console.log(result);

                                if (result.Result == 'Success')
                                    swal("Check Your Phone!", "We just sent you an SMS message. Reply with 'Go' to verify your phone number.", "success");
                                else
                                    swal("Error", "We were unable to re-send the verification SMS.  Please try again or contact Nooch Support.", "error");
                            })
                            .error(function (error) {
                                console.log('ResendVerificationSMS Error: [' + JSON.stringify(error) + ']');

                                if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
                                    CommonServices.logOut();
                                else
                                    swal("Error", "We were unable to re-send the verification SMS.  Please try again or contact Nooch Support.", "error");
                            });
                     }
                     else
                     {
                         $timeout(function () {
                             $state.go('app.profile');
                         }, 500);
                     }
                 }
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
             })
             .error(function (data) {
                 console.log('GetSynapseBankAndUserDetails Error: [' + data + ']');
                 $ionicLoading.hide();
                 if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                     CommonServices.logOut();
             });
         //  }
         //else
         //  swal("Oops...", "Internet not connected!", "error");
     }
	 
	 
     $scope.showBankNotVerifiedModal = function () {
		 
		 var bodyTxt = "Your bank account needs additional verification because either:" +
				       "<ul><li>we were unable to match the profile information you entered with the info listed on this bank account</li>" +
				       "<li>you added the bank with a routing & account #, so we need to verify that you own the account.</li></ul>" +
				 	   "<span class='show f-18 f-600 text-primary'>What To Do Now</span>" +
		 			   "<span class='show m-t-5'>Submit a picture of any valid photo ID. &nbsp;Email it to <span class='f-500'>support@nooch.com</span>, or tap <span class='f-500'>\"Submit ID\"</span> below.</span>";
		
		 var confirmBtnTxt = "Submit ID";

		 if ($scope.bankData.isBankAddedManually == true)
		 {
			 bodyTxt = "Before you can send funds with this account, we are required to verify that you are the account owner. &nbsp;We will make 2 'microdeposits' ($0.00 - $0.99) to your account." +
			 			"<span class='show f-18 f-600 text-primary'>What To Do Now</span>" +
			 			"<span class='show'>Just check your bank statement and then verify your account by clicking the link we emailed you and entering the 2 microdeposit amounts.</span>";
			 confirmBtnTxt = "Verify Now";
		 }

         swal({
             title: "Verify Your Bank",
             text: bodyTxt,
             showCancelButton: true,
             cancelButtonText: "Close",
             confirmButtonColor: "#3fabe1",
             confirmButtonText: confirmBtnTxt,
             html: true,
			 customClass: "text-left"
         }, function (isConfirm) {
             if (isConfirm)
			 {
				 if ($scope.bankData.isBankAddedManually == true)
				 {
					$state.go('app.uploadID');
				 }
				 else
				 {
					$state.go('app.uploadID');
				 }
			 }
         });
     };


	 $scope.$on('$ionicView.leave', function() {
		 $scope.editBank = false;
	 });
 })