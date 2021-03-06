﻿angular.module('noochApp.SettingCtrl', ['noochApp.settings-service', 'noochApp.services', 'ngStorage'])

 .controller('SettingCtrl', function ($scope, $rootScope, $timeout, $state, $ionicModal, $ionicLoading, $localStorage,
	                                  $cordovaSocialSharing, $sce, $ionicContentBanner, $ionicPlatform, $cordovaGoogleAnalytics,
	                                  CommonServices, settingsService) {

     $scope.$on("$ionicView.beforeEnter", function (event, data) {
         //console.log("SETTINGS -> beforeEnter fired");

         if ($scope.bankData == null)
         {
             console.log('$scope.bankData == null');
             $scope.bankData = {
                 bankLogoUrl: '././img/bank.png'
             };
         }

         $scope.editBank = false;
         $scope.shouldDisplayErrorBanner = false;
         $scope.errorBannerTextArray = [];

         $timeout(function () {
             //console.log("Settings -> BeforeEnter -> Timeout Fired");
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
                     icon: 'ion-close-circled',
                     cancelOnStateChange: false
                 });

                 $scope.isBannerShowing = true;
             }
             else
                 $scope.isBannerShowing = false;
         }, 500);

         $scope.url = $rootScope.baseNoochWebUrl + 'AddBank?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId;
         $scope.trustedUrl = $sce.trustAsResourceUrl($scope.url);
     });


     $scope.$on("$ionicView.enter", function (event, data) {
         $ionicPlatform.ready(function () {
             if (typeof analytics !== 'undefined') analytics.trackView("Settings Main Screen");
         })
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
             text: "Are you sure you want to remove this bank account?<span class='show f-600 capitalize'>" + $scope.bankData.bankName +
			 	   "</span><span class='show f-500 m-b-15'>This cannot be undone.</span>",
             type: "warning",
             showCancelButton: true,
             confirmButtonClass: "btn-danger",
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
									  "<span class='show m-b-15 capitalize'>" + $scope.bankData.bankName + "</span>",
                                type: "success",
                                html: true,
                                customClass: "singleBtn"
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
             else
             {
                 $('#editBnkBtn span').addClass('animated bounceIn');
                 $scope.editBank = false;

                 //$timeout(function () {
                 //    $('#editBnkBtn span').removeClass('animated bounceIn');
                 //}, 1000);
             }
         });
     }


     $scope.openAddBank = function () {
         $scope.editBank = false;

         if ($rootScope.Status == "Suspended" ||
             $rootScope.Status == "Temporarily_Blocked")
         {
             var showCancelButton = false;
             var bodyTxt = "For security your account has been suspended pending a review." +
                           "<span class='show'>We really apologize for the inconvenience and ask for your patience. Our top priority is keeping Nooch safe and secure.</span>";

             if (window.cordova)
             {
                 showCancelButton = true;
                 bodyTxt += "<span class='show'>Please contact us at support@nooch.com if this is a mistake or for more information."
             }
             swal({
                 title: "Account Suspended",
                 text: bodyTxt,
                 type: "error",
                 showCancelButton: showCancelButton,
                 cancelButtonText: "Contact Support",
                 customClass: "smallText",
                 html: true,
             }, function (isConfirm) {
                 if (!isConfirm)
                 {
                     //.shareViaEmail(message, subject, toArr, ccArr, bccArr, file) --Params
                     $cordovaSocialSharing
                       .shareViaEmail('', 'Nooch Support Request - Account Suspended', 'support@nooch.com', null, null, null)
                       .then(function (res) {
                       }, function (err) {
                           console.log('Error attempting to send email from social sharing: [' + JSON.stringify(err) + ']');
                       });
                 }
             });
         }
         else if ($rootScope.Status == "Registered")
         {
             swal({
                 title: "Please Verify Your Email",
                 text: "Terribly sorry, but before you send money or add a bank account, please confirm your email address by clicking the link we sent to the email address you used to sign up.",
                 type: "warning",
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
                                swal({
                                    title: "Check Your Email",
                                    text: "We just sent an email to " + $rootScope.emailAddress + ". Please click the verification link to activate your account.",
                                    type: "success",
                                    customClass: "singleBtn"
                                });
                            else
                                swal("Error", "We were unable to re-send the email verification link. Please try again or contact Nooch Support.", "error");
                        })
                        .error(function (error) {
                            console.log('ResendVerificationLink Error: [' + JSON.stringify(error) + ']');

                            if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
                                CommonServices.logOut();
                            else
                                swal("Error", "We were unable to re-send the email verification link. Please try again or contact Nooch Support.", "error");
                        });
                 }
             });
         }
         else if ($rootScope.IsPhoneVerified == false)
         {
             var isPhoneAdded = false;
             var bodyTxt = "Would you like to add a number now?";
             var confirmBtnTxt = "Add Now";

             if ($rootScope.contactNumber != null && $rootScope.contactNumber != "")
             {
                 isPhoneAdded = true;
                 bodyTxt = "You should have received a text message from us. Just respond 'Go' to confirm your number.";
                 confirmBtnTxt = "Resend SMS";
             }

             swal({
                 title: "Blame The Lawyers",
                 text: "To keep Nooch safe, we ask all users to verify a phone number before sending money." +
                       "<span class='show'>" + bodyTxt + "</span>",
                 type: "warning",
                 showCancelButton: true,
                 cancelButtonText: "OK",
                 confirmButtonText: confirmBtnTxt,
                 html: true
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
                                    swal({
                                        title: "Check Your Messages",
                                        text: "We just sent a text message to <span class='show f-600'>" + $rootScope.contactNumber +
		                                     "</span><span class='show'>Please respond <strong>\"Go\"</strong> to confirm your number (case doesn't matter).</span>",
                                        type: "success",
                                        html: true,
                                        customClass: "singleBtn"
                                    });
                                else if (result.Result == 'Invalid phone number')
                                {
                                    swal({
                                        title: "Invalid Phone Number",
                                        text: "Looks like your phone number isn't valid! Please update your number and try again or contact Nooch Support.",
                                        type: "error",
                                        showCancelButton: true,
                                        cancelButtonText: "OK",
                                        confirmButtonText: "Update Number",
                                        html: true
                                    }, function (isConfirm) {
                                        if (isConfirm)
                                        {
                                            $timeout(function () {
                                                $state.go('app.profile');
                                            }, 500);
                                        }
                                    });
                                }
                                else
                                    swal("Error", "We were unable to re-send the verification SMS.  Please try again or contact Nooch Support.", "error");
                            })
                            .error(function (error) {
                                $ionicLoading.hide();
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
                 text: "Please take 1 minute to verify your identity by completing your profile.",
                 type: "warning",
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

         swal({
             title: "Sign Out?",
             text: "Are you sure you want to sign out?",
             type: "warning",
             showCancelButton: true,
             cancelButtonText: "Cancel",
             confirmButtonText: "Yes - Logout"
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

     };


     $scope.checkBankDetails = function () {
         console.log('CheckBankDetails Fired');

         //if ($cordovaNetwork.isOnline()) {
         $ionicLoading.show({
             template: 'Assembling Your Settings...'
         });

         settingsService.GetSynapseBankAndUserDetails()
             .success(function (data) {
                 //console.log(data);
                 $scope.bankData = data;

                 $rootScope.bank_node = $scope.bankData.bank_node_id;

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
         //  swal("Error", "Internet not connected!", "error");
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
             confirmButtonText: confirmBtnTxt,
             html: true,
             customClass: "text-left"
         }, function (isConfirm) {
             if (isConfirm)
             {
                 if ($scope.bankData.isBankAddedManually == true)
                     $state.go('app.microDeposit');
                 else
                     $state.go('app.uploadID');
             }
         });
     };


     // CC (9/19/16): Called from $rootScope.ionicContentBannerHasHidden() which is fired from ionic.content.banner.js
     $scope.$on("ionicContentBannerHasHidden", function () {
         $scope.isBannerShowing = false;
     });


     $scope.$on('$ionicView.leave', function () {
         $scope.editBank = false;
     });

 })