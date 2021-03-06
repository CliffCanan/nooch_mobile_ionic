﻿angular.module('noochApp.HomeCtrl', ['ngCordova', 'noochApp.services', 'noochApp.home-service'])


/****************/
/***   HOME   ***/
/****************/
.controller('HomeCtrl', function ($scope, $rootScope, $state, $ionicPlatform, $cordovaGoogleAnalytics, $timeout, $http,
                                  $ionicLoading, $ionicContentBanner, $localStorage, $cordovaContacts, $cordovaSocialSharing,
                                  authenticationService, profileService, selectRecipientService, CommonServices, homeServices, $ionicActionSheet, historyService) {

    $scope.memberList = [];
    $scope.phoneContacts = [];

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        //console.log('Home Ctrl BeforeEnter Fired');

        if ($('#searchMoreFriends').hasClass('flipOutX'))
            $('#searchMoreFriends').removeClass('flipOutX');

        $scope.shouldDisplayErrorBanner = false;
        $scope.errorBannerTextArray = [];

        if ($localStorage.GLOBAL_VARIABLES.MemberId == null ||
			$localStorage.GLOBAL_VARIABLES.MemberId == '')
        {
            console.log("HOME CNTRL -> MemberId == '' so calling LOGOUT CommonService");
            CommonServices.logOut();
        }
    });


    $scope.$on("$ionicView.enter", function (event, data) {
        //console.log('Home Ctrl Enter Fired');

        $scope.memberList = [];
        $scope.phoneContacts = [];

        $ionicPlatform.ready(function () {
            if (typeof analytics !== 'undefined') analytics.trackView("Home");
        })
    });


    $scope.$on("$ionicView.afterEnter", function (event, data) {
        //console.log("Home Cntrl --> After Enter Fired");

        $timeout(function () {
            //console.log($localStorage.GLOBAL_VARIABLES);

            if ($localStorage.GLOBAL_VARIABLES.MemberId != null &&
                $localStorage.GLOBAL_VARIABLES.MemberId != '')
            {
                if ($rootScope.Status === "Suspended" ||
	                $rootScope.Status === "Temporarily_Blocked")
                {
                    $scope.errorBannerTextArray.push('ACCOUNT SUSPENDED');
                    $scope.shouldDisplayErrorBanner = true;
                }
                else
                {
                    if ($rootScope.IsPhoneVerified == false)
                    {
                        $scope.errorBannerTextArray.push('ACTION REQUIRED: Phone Number Not Verified');
                        $scope.shouldDisplayErrorBanner = true;
                    }
                    if ($rootScope.isProfileComplete == false ||
		                $rootScope.Status == "Registered")
                    {
                        $scope.errorBannerTextArray.push('ACTION REQUIRED: Profile Not Complete');
                        $scope.shouldDisplayErrorBanner = true;
                    }
                    if ($rootScope.hasSynapseBank == false)
                    {
                        $scope.errorBannerTextArray.push('ACTION REQUIRED: Missing Bank Account');
                        $scope.shouldDisplayErrorBanner = true;
                    }
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
                    //$('#fav-container').css('margin-top', '40px');
                }
                else
                {
                    console.log("Home Cntrl --> AfterEnter --> About to call PendingList()");
                    $scope.pendingList();
                }

                $scope.FindRecentFriends();
                $scope.deviceIp();
            }

        }, 1000);


        if (window.cordova)
        {
            if ($rootScope.isProfileComplete == true &&
				$localStorage.GLOBAL_VARIABLES.DeviceToken == '' &&
				$localStorage.GLOBAL_VARIABLES.IsNotificationPermissionGiven == false)
            {
                window.plugins.OneSignal.registerForPushNotifications();
            }
        }
    });


    $scope.FindRecentFriends = function () {
        //if ($cordovaNetwork.isOnline())
        //{
        $ionicLoading.show({
            template: 'Loading...'
        });

        selectRecipientService.GetRecentMembers()
			.success(function (data) {
			    $scope.memberList = data;

			    if ((data[0] == null || data.length < 5) && window.cordova)
			    {
			        console.log('Got Recent Members Empty or less than 5, Loading phone contacts ..');

			        cordova.plugins.diagnostic.isContactsAuthorized(function (authorized) {
			            console.log("App is " + (authorized ? "authorized" : "denied") + " access to contacts");

			            if (authorized)
			            {
			                $ionicPlatform.ready(function () {
			                    $scope.fetchContacts();
			                });
			            }
			            else
			            {
			                $ionicLoading.hide();

			                swal({
			                    title: "Use Address Book?",
			                    text: "Sending money to friends is simple when you have them in your phone's address book. " +
	                                  "Otherwise you'll have to manually type their email address or phone number.",
			                    type: "info",
			                    showCancelButton: true,
			                    cancelButtonText: "Not Now",
			                    confirmButtonText: "Authorize",
			                }, function (isConfirm) {
			                    if (isConfirm)
			                    {
			                        cordova.plugins.diagnostic.requestContactsAuthorization(function (status) {
			                            if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED)
			                            {
			                                console.log("Contacts use is authorized");
			                                $scope.fetchContacts();
			                            }
			                            //else
			                            //    console.log("Contact permisison is " + status);
			                        }, function (error) {
			                            console.error(error);
			                        });
			                    }
			                });
			            }
			        }, function (error) {
			            $ionicLoading.hide();
			            console.error("isContactsAuthorized Error: [" + error + "]");
			        });
			    }
			    else
			        $scope.setFavoritesForDisplay();
			})
			.error(function (error) {
			    $ionicLoading.hide();
			    console.log(JSON.stringify(error));
			    if (error == null || error.ExceptionMessage == 'Invalid OAuth 2 Access')
			        CommonServices.logOut();
			})
    }


    $scope.fetchContacts = function () {

        var options = {
            multiple: true
        };

        $scope.readContact = {
            FirstName: '',
            UserName: '',
            ContactNumber: '',
            Photo: '././img/profile_picture.png',
            id: '',
            bit: '',
            otherEmails: [],
            otherPhoneNumbers: []
        };

        $cordovaContacts.find(options).then(onSuccess, onError);

        function onSuccess(contacts) {
            //console.log('Phone Contacts...');
            //console.log(contacts);

            if ($rootScope.homeContactLength != contacts.length)
            {
                $rootScope.homeContactLength = contacts.length;

                for (var i = 0; i < contacts.length; i++)
                {
                    var contact = contacts[i];

                    if (contact.name.formatted != null && contact.emails != null)
                    {
                        $scope.readContact.FirstName = contact.name.formatted;
                        $scope.readContact.id = i;
                        $scope.readContact.bit = 'p';

                        $scope.readContact.UserName = contact.emails[0].value;

                        if (contact.emails.length > 1)
                        {
                            for (var n = 1; n < contact.emails.length; n++) // start at 2nd, we already have the 1st
                            {
                                if (CommonServices.ValidateEmail(contact.emails[n].value))
                                {
                                    $scope.readContact.otherEmails.push({ 'value': contact.emails[n].value }, { 'type': contact.emails[n].type })
                                }
                            }
                        }

                        if (contact.phoneNumbers != null)
                        {
                            $scope.readContact.ContactNumber = contact.phoneNumbers[0].value;
                            $scope.readContact.otherPhoneNumbers = contact.phoneNumbers;
                        }

                        if (contact.photos != null)
                            $scope.readContact.Photo = contact.photos[0].value;

                        $scope.phoneContacts.push($scope.readContact);
                        $rootScope.homeContacts.push($scope.readContact);
                        $scope.readContact = {
                            FirstName: '',
                            UserName: '',
                            ContactNumber: '',
                            Photo: '././img/profile_picture.png',
                            id: '',
                            bit: '',
                            otherEmails: [],
                            otherPhoneNumbers: []
                        };
                    }
                }
            }
            else
            {
                $scope.phoneContacts.push.apply($scope.phoneContacts, $rootScope.homeContacts);
            }

            //console.log($scope.phoneContacts);

            $scope.setFavoritesForDisplay();
        };

        function onError(error) {
            console.log('fetchContacts Error: [' + JSON.stringify(error) + ']');
            $ionicLoading.hide();
        };
    }


    $scope.setFavoritesForDisplay = function () {

        $scope.FavoritesToDisplay = [];

        for (var j = 0; j < $scope.memberList.length; j++)
        {
            if ($scope.memberList[j].Photo == null || $scope.memberList[j].Photo == "")
                $scope.memberList[j].Photo = "./img/profile_picture.png";

            $scope.FavoritesToDisplay.push($scope.memberList[j]);
        }

        if ($scope.phoneContacts.length > 5)
        {
            $scope.phoneContacts = shuffle($scope.phoneContacts);

            var lenToRun = 5 - $scope.memberList.length;

            for (var i = 0; i < lenToRun; i++)
            {
                if ($scope.phoneContacts[i].Photo == null || $scope.phoneContacts[i].Photo == "")
                    $scope.phoneContacts[i].Photo = "./img/profile_picture.png";

                $scope.FavoritesToDisplay.push($scope.phoneContacts[i]);
            }
        }
        else
        {
            for (var j = 0; j < 5; j++)
            {
                if ($scope.FavoritesToDisplay.length >= 5 || j >= $scope.phoneContacts.length)
                    break;

                if ($scope.phoneContacts[j].Photo == null || $scope.phoneContacts[j].Photo == "")
                    $scope.phoneContacts[j].Photo = "./img/profile_picture.png";

                $scope.FavoritesToDisplay.push($scope.phoneContacts[j]);
            }
        }

        $scope.FavoritesToDisplay = shuffle($scope.FavoritesToDisplay);

        $ionicLoading.hide();
    }


    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex)
        {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }


    $scope.pendingList = function () {

        historyService.getTransferList('Pending')
            .success(function (data) {

                if (data.length > 0)
                {
                    //console.log(data.length);
                    $rootScope.pendingTransfersCount = data.length;

                    var text = $rootScope.pendingTransfersCount > 1
                    ? $rootScope.pendingTransfersCount + ' Pending Requests Waiting'
                    : '1 Pending Request Waiting';

                    $ionicContentBanner.show({
                        text: [text],
                        type: 'info'
                    });
                    $scope.isBannerShowing = true;
                }
                else
                    $scope.isBannerShowing = false;
            })
            .error(function (data) {
                console.log('GetTransferList Error: [' + JSON.stringify(data) + ']');
                $scope.isBannerShowing = false;
                if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                    CommonServices.logOut();
                else
                    CommonServices.DisplayError('Unexpected issue - sorry about that!');
            });
    }


    $scope.openFilterChoices = function (member) {

        console.log(member);

        $scope.buttonValues = {
            id: '',
            text: ''
        }

        if ($scope.checkUsersStatus() == true)
        {
            if (member.bit != 'p')
            {
                $state.go('app.howMuch', { recip: member });
            }
            else if (member.bit == 'p' && member.otherEmails == null || member.otherEmails.length < 2)
            {
                //check if phone or email is already registered with nooch i.e existing user
                var registeredMember = {
                    'FirstName': "",
                    'LastName': "",
                    'MemberId': "",
                    'Photo': ""
                }

                var type = "E";

                selectRecipientService.CheckMemberExistenceUsingEmailOrPhone(type, member.UserName)
                    .success(function (data) {

                        if (data.IsMemberFound == true)
                        {
                            registeredMember.FirstName = data.Name;
                            registeredMember.MemberId = data.MemberId;
                            registeredMember.Photo = data.UserImage;

                            $state.go('app.howMuch', { recip: registeredMember });
                        }
                        else
                        {
                            // member not found
                            var objForHowMuch = {
                                type: "email",
                                value: member.UserName,
                                photo: member.Photo,
                            }
                            console.log(member);
                            console.log(objForHowMuch);

                            $state.go('app.howMuch', { recip: objForHowMuch });
                        }
                    })
                    .error(function (error) {
                        if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
                            CommonServices.logOut();
                    });
            }
            else // Phone contact w/ multiple emails
            {
                var buttons = [];
                for (var i = 0; i < member.otherEmails.length; i++)
                {
                    if (i < 4)
                    {
                        if (CommonServices.ValidateEmail(member.otherEmails[i].value))
                        {
                            $scope.buttonValues.id = i;
                            $scope.buttonValues.text = member.otherEmails[i].value;
                            buttons.push($scope.buttonValues);
                            $scope.buttonValues = {
                                id: '',
                                text: ''
                            }
                        }
                    }
                }

                var hideSheet = $ionicActionSheet.show({
                    buttons: buttons,
                    titleText: "Which Email Address?",
                    cancelText: "Cancel",
                    buttonClicked: function (index) {
                        //check if phone or email is already registered with nooch i.e existing user
                        var registeredMember = {
                            'FirstName': "",
                            'LastName': "",
                            'MemberId': "",
                            'Photo': ""
                        }

                        var type = "E";

                        selectRecipientService.CheckMemberExistenceUsingEmailOrPhone(type, member.otherEmails[index].value)
                            .success(function (data) {

                                if (data.IsMemberFound == true)
                                {
                                    registeredMember.FirstName = data.Name;
                                    registeredMember.MemberId = data.MemberId;
                                    registeredMember.Photo = data.UserImage;
                                    $state.go('app.howMuch', { recip: registeredMember });
                                    return true;
                                }
                                else
                                {
                                    // member not found
                                    var objForHowMuch = {
                                        type: "email",
                                        value: member.otherEmails[index].value,
                                        photo: member.Photo,
                                    }

                                    $state.go('app.howMuch', { recip: objForHowMuch });

                                    return true;
                                }
                            })
                            .error(function (error) {
                                if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
                                    CommonServices.logOut();
                            });
                    }
                });
            }
        }
    };


    $scope.goToSelectRecip = function () {
        if ($scope.checkUsersStatus() == true)
        {
            $('#searchMoreFriends').addClass('flipOutX fast');
            $timeout(function () {
                $state.go('app.selectRecipient');
            }, 700);
        }
    }


    $scope.checkUsersStatus = function () {
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
                confirmButtonText: "Ok",
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
                text: "Before you send money or add a bank account, please confirm your email address by clicking the link we sent to <span class='f-500'>" + $rootScope.emailAddress + "</span>.",
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
	                               text: "We just sent an email to <span class='f-500'>" + $rootScope.emailAddress + "</span>.<span class='show'>Please click the verification link to activate your account.</show>",
	                               type: "success",
	                               customClass: "singleBtn",
	                               html: true
	                           });
	                       else
	                           swal("Error", "We were unable to re-send the email verification link.  Please try again or contact Nooch Support.", "error");
	                   })
					   .error(function (error) {
					       $ionicLoading.hide();
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
                confirmButtonText: confirmBtnTxt,
                showCancelButton: true,
                cancelButtonText: "Ok",
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
                               //console.log(result);

                               if (result.Result == 'Success')
                                   swal({
                                       title: "Check Your Messages",
                                       text: "We just sent a text message to <span class='show f-600'>" + $rootScope.contactNumber +
		                                     "</span><span class='show'>Please respond <strong>\"Go\"</strong> to confirm your number (case doesn't matter).</span>",
                                       type: "success",
                                       html: true,
                                       customClass: "singleBtn"
                                   });
                               else if (result.Result == 'Already Verified')
                                   swal({
                                       title: "You're Good To Go",
                                       text: "Your phone number has already been verified.",
                                       type: "success",
                                       customClass: "singleBtn heavierText"
                                   })
                               else if (result.Result == 'Invalid phone number')
                               {
                                   swal({
                                       title: "Invalid Phone Number",
                                       text: "Looks like your phone number isn't valid! Please update your number and try again or contact Nooch Support.",
                                       type: "error",
                                       confirmButtonText: "Update Number",
                                       showCancelButton: true,
                                       cancelButtonText: "Ok",
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
        else if ($rootScope.isProfileComplete == false)
        {
            swal({
                title: "Help Us Keep Nooch Safe",
                text: "Please take 1 minute to verify your identity by completing your Nooch profile.",
                type: "warning",
                confirmButtonText: "Go Now",
                showCancelButton: true,
                cancelButtonText: "Later",
            }, function (isConfirm) {
                if (isConfirm)
                    $state.go('app.profile');
            });
        }
        else if ($rootScope.hasSynapseBank == false)
        {
            swal({
                title: "Connect A Funding Source",
                text: "Adding a bank account to fund Nooch payments is lightning quick:" +
					  "<ul class='p-l-25 text-left'><li>No routing or account number needed</li><li>Bank-grade encryption keeps your info safe</li></ul>" +
					  "<span class='show m-b-15 f-400'>Would you like to take care of this now?</span>",
                type: "warning",
                confirmButtonText: "Go Now",
                showCancelButton: true,
                cancelButtonText: "Later",
                html: true,
            }, function (isConfirm) {
                $state.go('app.settings');
            });
        }
        else if ($rootScope.bankStatus == false)
        {
            swal({
                title: "Bank Account Un-Verified",
                text: "Looks like we need just a bit more info to verify your bank account. This usually happens when we were unable to match the contact info listed on the bank account with your Nooch profile information." +
					  "<span class='show'>Don't worry - we can solve this quickly. Please tap 'Learn More' for what to do next.</span>",
                type: "warning",
                confirmButtonText: "Learn More",
                showCancelButton: true,
                cancelButtonText: "Not Now",
                html: true,
            }, function (isConfirm) {
                $state.go('app.settings');
            });
        }
        else
            return true;

        return false;
    }


    $scope.deviceIp = function () {
        var url = 'http://ipv4.myexternalip.com/json';

        $http.get(url).then(function (result) {
            if ($localStorage.GLOBAL_VARIABLES.ip == null || $localStorage.GLOBAL_VARIABLES.ip == '')
            {
                //console.log('Local IP was NULL, saving: [' + result.data.ip + ']');
                $scope.updateDeviceIp(result.data.ip);
            }
            else if ($localStorage.GLOBAL_VARIABLES.ip != result.data.ip)
            {
                //console.log('IP Changed, NEW IP is [' + result.data.ip + '], OLD IP was:' + $localStorage.GLOBAL_VARIABLES.ip + ']');
                $scope.updateDeviceIp(result.data.ip);
            }
        }, function (error) {
            console.log('DeviceIP Error: [' + JSON.stringify(error) + ']');
        });
    }


    $scope.updateDeviceIp = function (ip) {
        homeServices.SaveIpAddress(ip)
          .success(function (data) {
              console.log(data);
              $localStorage.GLOBAL_VARIABLES.ip = ip;
          })
		  .error(function (error) {
		      console.log('UdateMemberIPAddress Error: [' + JSON.stringify(error) + ']');
		  });
    }


    // CC (9/19/16): Called from $rootScope.ionicContentBannerHasHidden() which is fired from ionic.content.banner.js (which I edited to add this)
    $scope.$on("ionicContentBannerHasHidden", function () {
        $scope.isBannerShowing = false;
    });
})
